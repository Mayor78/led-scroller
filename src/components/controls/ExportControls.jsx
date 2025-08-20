import React, { useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { FaCamera, FaVideo, FaShare, FaSave, FaFolderOpen, FaDownload, FaTimes } from 'react-icons/fa';

const ExportControls = () => {
  const { text, saveCurrentPreset, loadPreset } = useScrollerStore();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasStreamRef = useRef(null);

  const captureImage = async () => {
    try {
      const displayElement = document.querySelector('.led-display');
      if (!displayElement) {
        throw new Error('LED display not found');
      }

      Swal.fire({
        title: 'Capturing...',
        text: 'Taking a screenshot of your LED display',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Use the actual LED display element for capture
      const canvas = await html2canvas(displayElement, {
        backgroundColor: '#000000',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Ensure any dynamic elements are visible in the clone
          const clonedDisplay = clonedDoc.querySelector('.led-display');
          if (clonedDisplay) {
            // Make sure the display is visible in the clone
            clonedDisplay.style.visibility = 'visible';
            clonedDisplay.style.opacity = '1';
          }
        }
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const fileName = `led-scroller-${text || 'display'}-${Date.now()}.png`;

        Swal.fire({
          title: 'Capture Complete!',
          html: `
            <div style="text-align: center;">
              <img src="${url}" style="max-width: 100%; max-height: 200px; border: 2px solid #00ff41; border-radius: 8px; margin: 10px 0;" />
              <p style="color: #d1d5db; margin: 10px 0;">Ready to download "${fileName}"</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Download',
          cancelButtonText: 'Cancel',
          background: '#1f2937',
          color: 'white',
          customClass: {
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Capture error:', error);
      Swal.fire('Error', 'Failed to capture image. Please try again.', 'error');
    }
  };

  const startRecording = async () => {
    try {
      const displayElement = document.querySelector('.led-display');
      if (!displayElement) {
        throw new Error('LED display not found');
      }

      // Create a canvas to capture the LED display
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match LED display
      const rect = displayElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Create a stream from the canvas
      canvasStreamRef.current = canvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(canvasStreamRef.current, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000 // 5 Mbps
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const fileName = `led-scroller-${text || 'animation'}-${Date.now()}.webm`;

        Swal.fire({
          title: 'Recording Complete!',
          html: `
            <div style="text-align: center;">
              <video src="${url}" controls style="max-width: 100%; max-height: 200px; border: 2px solid #00ff41; border-radius: 8px; margin: 10px 0;"></video>
              <p style="color: #d1d5db; margin: 10px 0;">Ready to download "${fileName}"</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Download',
          cancelButtonText: 'Cancel',
          background: '#1f2937',
          color: 'white',
          customClass: {
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });

        setRecordedChunks([]);
      };

      recorder.start(1000); // Capture chunks every second
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Animation loop to capture LED display
      const captureFrame = () => {
        if (!isRecording) return;
        
        html2canvas(displayElement, {
          backgroundColor: '#000000',
          scale: 1,
          logging: false,
          useCORS: true,
          allowTaint: true
        }).then(captureCanvas => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(captureCanvas, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(captureFrame);
        }).catch(error => {
          console.error('Frame capture error:', error);
        });
      };

      captureFrame();

      // Show recording indicator
      Swal.fire({
        title: 'Recording...',
        html: `
          <div style="text-align: center;">
            <div style="width: 20px; height: 20px; background: #ef4444; border-radius: 50%; margin: 0 auto; animation: pulse 1s infinite;"></div>
            <p style="color: #d1d5db; margin: 10px 0;">Recording your LED animation</p>
            <button onclick="window.stopRecording()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
              Stop Recording
            </button>
          </div>
        `,
        background: '#1f2937',
        showConfirmButton: false,
        allowOutsideClick: false
      });

      // Add global function to stop recording
      window.stopRecording = () => {
        if (recorder && recorder.state === 'recording') {
          recorder.stop();
        }
        setIsRecording(false);
        Swal.close();
      };

    } catch (error) {
      console.error('Recording error:', error);
      Swal.fire('Error', 'Failed to start recording: ' + error.message, 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      Swal.close();
    }
  };

  const shareContent = async () => {
    try {
      // First capture an image to share
      const displayElement = document.querySelector('.led-display');
      const canvas = await html2canvas(displayElement, {
        backgroundColor: '#000000',
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      canvas.toBlob(async (blob) => {
        const filesArray = [
          new File([blob], `led-scroller-${text || 'display'}.png`, {
            type: 'image/png',
          }),
        ];

        const shareData = {
          title: 'LED Scroller Display',
          text: `Check out my LED scroller: "${text || 'Awesome LED Display'}"`,
          files: filesArray,
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback: show download options
          const url = URL.createObjectURL(blob);
          Swal.fire({
            title: 'Share Options',
            html: `
              <div style="text-align: center;">
                <img src="${url}" style="max-width: 100%; max-height: 150px; border: 2px solid #00ff41; border-radius: 8px; margin: 10px 0;" />
                <p style="color: #d1d5db;">Share your LED creation</p>
                <div style="margin: 15px 0;">
                  <button onclick="window.downloadImage()" style="background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 6px; margin: 5px; cursor: pointer;">
                    Download Image
                  </button>
                </div>
              </div>
            `,
            background: '#1f2937',
            showConfirmButton: false,
            showCloseButton: true
          });

          window.downloadImage = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = `led-scroller-${text || 'display'}.png`;
            link.click();
            URL.revokeObjectURL(url);
            Swal.close();
          };
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Share error:', error);
      Swal.fire('Error', 'Sharing not supported: ' + error.message, 'error');
    }
  };

  const savePreset = async () => {
    const { value: presetName } = await Swal.fire({
      title: 'Save Preset',
      input: 'text',
      inputLabel: 'Preset Name',
      inputPlaceholder: 'Enter a name for your preset',
      showCancelButton: true,
      background: '#1f2937',
      color: 'white',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    });

    if (presetName) {
      saveCurrentPreset(presetName);
      Swal.fire('Saved!', `Preset "${presetName}" has been saved.`, 'success');
    }
  };

  const loadPresetDialog = async () => {
    // In a real app, you would load presets from storage
    const presets = JSON.parse(localStorage.getItem('ledScrollerPresets') || '{}');
    const presetNames = Object.keys(presets);

    if (presetNames.length === 0) {
      Swal.fire('No Presets', 'You haven\'t saved any presets yet.', 'info');
      return;
    }

    const { value: selectedPreset } = await Swal.fire({
      title: 'Load Preset',
      input: 'select',
      inputOptions: presetNames.reduce((options, name) => {
        options[name] = name;
        return options;
      }, {}),
      inputPlaceholder: 'Select a preset',
      showCancelButton: true,
      background: '#1f2937',
      color: 'white'
    });

    if (selectedPreset) {
      loadPreset(selectedPreset);
      Swal.fire('Loaded!', `Preset "${selectedPreset}" has been loaded.`, 'success');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
        <FaShare className="text-green-400" />
        Export & Share
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={captureImage}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all"
          disabled={isRecording}
        >
          <FaCamera className="text-lg" />
          <span className="text-sm">Capture Image</span>
        </button>
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white transition-all ${
            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isRecording ? <FaTimes className="text-lg" /> : <FaVideo className="text-lg" />}
          <span className="text-sm">{isRecording ? 'Stop Recording' : 'Record Video'}</span>
        </button>
        
        <button
          onClick={shareContent}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-all"
          disabled={isRecording}
        >
          <FaShare className="text-lg" />
          <span className="text-sm">Share</span>
        </button>
        
        <button
          onClick={savePreset}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-all"
          disabled={isRecording}
        >
          <FaSave className="text-lg" />
          <span className="text-sm">Save Preset</span>
        </button>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={loadPresetDialog}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm transition-all"
          disabled={isRecording}
        >
          <FaFolderOpen className="text-md" />
          <span>Load Preset</span>
        </button>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 z-50">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm">Recording...</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .swal-confirm-btn {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          padding: 10px 24px !important;
        }
        .swal-cancel-btn {
          background: #4b5563 !important;
          border: none !important;
          border-radius: 8px !important;
          color: white !important;
          padding: 10px 24px !important;
        }
      `}</style>
    </div>
  );
};

export default ExportControls;
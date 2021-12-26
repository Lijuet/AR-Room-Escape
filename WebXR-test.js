// button to start XR experience
let xrButton = document.getElementById('xr-button');

// to control the xr session
let xrSession = null;

// reference space used within an application
let xrRefSpace = null;

// Canvas OpenGL context used for rendering
let gl = null;

async function activateXR() {
	// Add a canvas element and initialize a WebGL context that is compatible with WebXR.
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const gl = canvas.getContext("webgl", { xrCompatible: true });

    // To be continued in upcoming steps.
}

function checkXR() {
  if (!window.isSecureContext) {
    document.getElementById("warning").innerText = "WebXR unavailable. Please use secure context";
  }
  if (navigator.xr) { // check to see if WebXR is supported
    navigator.xr.addEventListener('devicechange', checkSupportedState);
    checkSupportedState();
  } else {
    document.getElementById("warning").innerText = "WebXR unavailable for this browser";
  }
}

function checkSupportedState() {
  navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
    if (supported) {
      xrButton.innerHTML = 'Enter AR';
      xrButton.addEventListener('click', onButtonClicked);
    } else {
      xrButton.innerHTML = 'AR not found';
    }
    xrButton.disabled = !supported;
  });
}

function onSessionStarted(session) {
  xrSession = session;
  xrButton.innerHTML = 'Exit AR';

  // Show which type of DOM Overlay got enabled (if any)
  if (session.domOverlayState) {
    document.getElementById('info').innerHTML = 'DOM Overlay type: ' + session.domOverlayState.type;
  }

  session.addEventListener('end', onSessionEnded);
  // create a canvas element and WebGL context for rendering
  let canvas = document.createElement('canvas');
  gl = canvas.getContext('webgl', { xrCompatible: true });
  session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) });

  session.requestReferenceSpace('local').then((refSpace) => {
    xrRefSpace = refSpace;
    // start WebXR rendering loop
    session.requestAnimationFrame(onXRFrame);
  });

}

function onRequestSessionError(ex) {
  document.getElementById('info').innerHTML = "Failed to start AR session.";
}
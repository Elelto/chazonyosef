export const applyGradient = (gradientSettings) => {
  if (!gradientSettings) return;

  const root = document.documentElement;
  const body = document.body;

  // Support both old format (startColor/endColor) and new format (colors array)
  let colors = gradientSettings.colors;
  if (!colors && gradientSettings.startColor && gradientSettings.endColor) {
    // Backward compatibility
    colors = [gradientSettings.startColor, gradientSettings.endColor];
  }
  if (!colors) {
    colors = ['#1e3a8a', '#4c1d95', '#7c3aed'];
  }

  root.style.setProperty('--gradient-colors', colors.join(', '));
  root.style.setProperty('--gradient-direction', gradientSettings.direction || 'to right');

  if (gradientSettings.enabled) {
    body.classList.add('gradient-enabled');
    // Apply gradient directly to body
    body.style.background = `linear-gradient(${gradientSettings.direction || 'to right'}, ${colors.join(', ')})`;
    body.style.backgroundAttachment = 'fixed';
  } else {
    body.classList.remove('gradient-enabled');
    body.style.background = '';
    body.style.backgroundAttachment = '';
  }
};

export const applyButtonGradient = (buttonGradientSettings) => {
  if (!buttonGradientSettings) return;

  const root = document.documentElement;

  let colors = buttonGradientSettings.colors || ['#4f46e5', '#7c3aed'];
  
  root.style.setProperty('--button-gradient-colors', colors.join(', '));
  root.style.setProperty('--button-gradient-direction', buttonGradientSettings.direction || 'to right');

  if (buttonGradientSettings.enabled) {
    document.body.classList.add('button-gradient-enabled');
  } else {
    document.body.classList.remove('button-gradient-enabled');
  }
};

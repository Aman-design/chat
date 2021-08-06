// Write event names in the format <action::model::attribute>
export const WIDGET_EVENTS = {
  // These are old events, but we still need to support them
  // in case some has built on top of these event names.
  // Naming is pathetic, but let us keep the value as old one
  // and the key as the new intended activity
  TOGGLE_MOBILE_VIEW: 'toggle-close-button',
  WIDGET_INITIALIZE_COMPLETE: 'config-set',
};

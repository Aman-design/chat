// Write event names in the format <action::model::attribute>
export const WIDGET_EVENTS = {
  // These are old events, but we still need to support them
  // in case some has built on top of these event names.
  // Naming is pathetic, but let us keep the value as old one
  // and the key as the new intended activity

  // All events sent from the Vue app to the SDK should be prefixed with 'F_'
  // All events sent from the SDK to the Vue app should be prefixed with 'T_'

  // Sent to Vue App
  T_TOGGLE_MOBILE_VIEW: 'toggle-close-button',
  T_WIDGET_INITIALIZE_COMPLETE: 'config-set',
  T_UPDATE_WEBSITE_URL: 'change-url',

  // Sent from Vue App
  F_SET_COOKIE_INFORMATION: 'loaded',
};

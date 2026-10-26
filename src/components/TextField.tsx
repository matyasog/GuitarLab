import { useState, type ReactNode, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputInstance, type TextInputProps } from 'react-native';

import { colors, fontFamilies, radii, space, typeSize } from '@/theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

export type TextFieldProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label: string;
  // Shown on the right of the label row, e.g. the "Forgot password?" button.
  labelAccessory?: ReactNode;
  // Line under the field. "success" is green (e.g. "Reset link sent…").
  helper?: string;
  helperTone?: 'muted' | 'success';
  // When set, the field gets a red border and this text replaces the helper.
  error?: string;
  // Inside the field on the right, e.g. the Show/Hide button of PasswordField.
  trailing?: ReactNode;
  // Under the error or helper line, always visible, e.g. the live password rules on Sign up.
  footer?: ReactNode;
  // Lets a screen move the focus here, e.g. from Email to Password with the keyboard's "Next".
  inputRef?: Ref<TextInputInstance>;
};

// Labelled single-line input, from "Text field / default · focused · error" in the design.
export function TextField({
  label,
  labelAccessory,
  helper,
  helperTone = 'muted',
  error,
  trailing,
  footer,
  inputRef,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.red : focused ? colors.amber : colors.line2;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <AppText variant="label14" color="text2">
          {label}
        </AppText>
        {labelAccessory}
      </View>

      <View style={[styles.field, { borderColor }, trailing ? styles.withTrailing : null]}>
        <TextInput
          {...inputProps}
          ref={inputRef}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          placeholderTextColor={colors.subtle}
          cursorColor={colors.amber}
          selectionColor={colors.amber}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={styles.input}
        />
        {trailing}
      </View>

      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Icon name="circle-alert" size={16} color="red" />
          <AppText variant="helper14" color="red" style={styles.messageText}>
            {error}
          </AppText>
        </View>
      ) : helper ? (
        <AppText variant="helper14" color={helperTone === 'success' ? 'green' : 'muted'}>
          {helper}
        </AppText>
      ) : null}

      {/* The footer stays visible under an error, e.g. the password rules show what is missing. */}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    gap: space[8],
  },
  labelRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    paddingLeft: space[16],
    paddingRight: space[16],
    borderWidth: 1,
    borderRadius: radii.control,
    backgroundColor: colors.surface,
  },
  withTrailing: {
    paddingRight: space[4],
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    color: colors.text,
    fontFamily: fontFamilies.ui400,
    fontSize: typeSize[16],
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[8],
  },
  messageText: {
    flex: 1,
  },
});

/**
 * Custom hook for managing booking form state and validation.
 * Handles form data, validation, submission, and integration with the store.
 * 
 * Requirements: 3.1
 */

import { useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { validateBookingForm } from '../utils/validation';
import type { BookingRequest } from '../types/booking';
import type { FormValidationResult } from '../types/booking';

export interface BookingFormData {
  customerName: string;
  email: string;
  phone: string;
  vehicleId: string;
  startDate: Date | null;
  endDate: Date | null;
  withDriver: boolean;
}

export interface UseBookingFormReturn {
  formData: BookingFormData;
  validationResult: FormValidationResult | null;
  isSubmitting: boolean;
  updateField: <K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) => void;
  validateForm: () => FormValidationResult;
  submitForm: () => Promise<BookingRequest | null>;
  resetForm: () => void;
  setFormData: (data: Partial<BookingFormData>) => void;
}

const initialFormData: BookingFormData = {
  customerName: '',
  email: '',
  phone: '',
  vehicleId: '',
  startDate: null,
  endDate: null,
  withDriver: false,
};

/**
 * Hook for managing booking form state, validation, and submission.
 * Integrates with Zustand store for booking persistence.
 * 
 * @param preselectedVehicleId - Optional vehicle ID to pre-populate the form
 * @returns Form state and management functions
 */
export function useBookingForm(
  preselectedVehicleId?: string
): UseBookingFormReturn {
  const [formData, setFormDataState] = useState<BookingFormData>({
    ...initialFormData,
    vehicleId: preselectedVehicleId || '',
  });
  const [validationResult, setValidationResult] =
    useState<FormValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBooking = useAppStore((state) => state.addBooking);
  const showNotification = useAppStore((state) => state.showNotification);

  /**
   * Updates a single form field.
   */
  const updateField = useCallback(
    <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
      setFormDataState((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear validation errors when user starts typing
      if (validationResult && !validationResult.isValid) {
        setValidationResult(null);
      }
    },
    [validationResult]
  );

  /**
   * Updates multiple form fields at once.
   */
  const setFormData = useCallback((data: Partial<BookingFormData>) => {
    setFormDataState((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  /**
   * Validates the current form data.
   */
  const validateForm = useCallback((): FormValidationResult => {
    const result = validateBookingForm({
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      vehicleId: formData.vehicleId,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    });
    setValidationResult(result);
    return result;
  }, [formData]);

  /**
   * Submits the booking form.
   * Validates data, creates booking request, saves to store, and shows notification.
   * 
   * @returns The created BookingRequest or null if validation fails
   */
  const submitForm = useCallback(async (): Promise<BookingRequest | null> => {
    setIsSubmitting(true);

    try {
      // Validate form
      const result = validateForm();
      if (!result.isValid) {
        showNotification('Mohon perbaiki kesalahan pada form', 'error');
        return null;
      }

      // Create booking request
      const booking: BookingRequest = {
        id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        vehicleId: formData.vehicleId,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        withDriver: formData.withDriver,
        totalPrice: 0, // Will be calculated by the component using usePriceCalculator
        createdAt: new Date(),
        status: 'pending',
      };

      // Save to store (which also saves to localStorage)
      addBooking(booking);

      // Show success notification
      showNotification('Booking berhasil disimpan!', 'success');

      return booking;
    } catch (error) {
      console.error('Error submitting booking form:', error);
      showNotification('Terjadi kesalahan saat menyimpan booking', 'error');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, addBooking, showNotification]);

  /**
   * Resets the form to initial state.
   */
  const resetForm = useCallback(() => {
    setFormDataState({
      ...initialFormData,
      vehicleId: preselectedVehicleId || '',
    });
    setValidationResult(null);
    setIsSubmitting(false);
  }, [preselectedVehicleId]);

  return {
    formData,
    validationResult,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
    resetForm,
    setFormData,
  };
}

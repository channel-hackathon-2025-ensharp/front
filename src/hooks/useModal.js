// src/hooks/useModal.js
import { useState, useCallback } from "react";

/**
 * Custom hook for managing modal state and associated data
 *
 * @param {boolean} initial - Initial open state of the modal (default: false)
 * @returns {Object} Modal state and control functions
 * @returns {boolean} returns.isOpen - Current open state of the modal
 * @returns {Function} returns.open - Function to open modal (optionally with data)
 * @returns {Function} returns.close - Function to close modal
 * @returns {Function} returns.toggle - Function to toggle modal state
 * @returns {*} returns.data - Data associated with the modal
 *
 * @example
 * const { isOpen, open, close, data } = useModal();
 *
 * // Open modal with data
 * const handleClick = (item) => {
 *   open(item);
 * };
 *
 * // Use data in modal
 * <Modal isOpen={isOpen} onClose={close}>
 *   {data && <div>{data.name}</div>}
 * </Modal>
 */
export default function useModal(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const [data, setData] = useState(null);

  const open = useCallback((newData) => {
    if (newData !== undefined) {
      setData(newData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle, data };
}

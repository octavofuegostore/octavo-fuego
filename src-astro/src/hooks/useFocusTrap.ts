import { useEffect, useRef, type RefObject } from 'react'

/**
 * Focus trap hook for modals, dialogs, and slide panels.
 *
 * - Traps Tab/Shift+Tab focus cycling within the container
 * - Calls `onClose` on Escape
 * - Returns focus to the trigger element on unmount
 *
 * @param isActive - Whether the trap is active (modal open)
 * @param onClose - Callback when Escape is pressed
 * @returns A ref to attach to the container element
 */
export function useFocusTrap(
  isActive: boolean,
  onClose?: () => void,
): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const previousActiveElement = useRef<Element | null>(null)

  useEffect(() => {
    if (!isActive) return

    // Save the currently focused element so we can restore it later
    previousActiveElement.current = document.activeElement

    const container = containerRef.current
    if (!container) return

    // Focus the first focusable element inside the container
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

    function getFocusableElements(): HTMLElement[] {
      if (!container) return []
      return Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector),
      )
    }

    function focusFirstElement() {
      const focusable = getFocusableElements()
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        // If no focusable elements, focus the container itself
        container?.focus()
      }
    }

    // Small delay to let the modal render before focusing
    requestAnimationFrame(focusFirstElement)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the element that triggered the modal
      if (
        previousActiveElement.current &&
        'focus' in previousActiveElement.current
      ) {
        try {
          ;(previousActiveElement.current as HTMLElement).focus()
        } catch {
          // Element may no longer be in the DOM, ignore
        }
      }
    }
  }, [isActive, onClose])

  return containerRef
}

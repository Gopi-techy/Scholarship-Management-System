import { useEffect } from 'react';

/**
 * Custom hook to set the document title dynamically
 * @param title - The title to set for the current page
 * @param retainAppName - Whether to append the app name to the title (default: true)
 */
export const useDocumentTitle = (title: string, retainAppName: boolean = true): void => {
  const appName = 'Scholarship Management System';

  useEffect(() => {
    const prevTitle = document.title;
    
    if (retainAppName) {
      document.title = title ? `${title} | ${appName}` : appName;
    } else {
      document.title = title;
    }

    // Cleanup: restore previous title when component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [title, retainAppName, appName]);
};

export default useDocumentTitle;

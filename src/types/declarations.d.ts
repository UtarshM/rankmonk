declare module "sonner" {
  export const toast: {
    (message: string | React.ReactNode, data?: any): string | number;
    success: (message: string | React.ReactNode, data?: any) => string | number;
    error: (message: string | React.ReactNode, data?: any) => string | number;
    info: (message: string | React.ReactNode, data?: any) => string | number;
    warning: (message: string | React.ReactNode, data?: any) => string | number;
    loading: (message: string | React.ReactNode, data?: any) => string | number;
    promise: (promise: Promise<any> | (() => Promise<any>), data?: any) => string | number;
    dismiss: (id?: string | number) => string | number;
  };
  export const Toaster: React.FC<any>;
}

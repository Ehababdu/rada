# Sonner Toast Notifications

This project uses [Sonner](https://sonner.emilkowalski.ski/) for toast notifications, integrated with Shadcn UI.

## Features

- 🎨 Beautiful, animated toast notifications
- 🌙 Dark/Light theme support
- 🎯 Multiple toast types (success, error, warning, info, default)
- 📱 Responsive design
- 🔧 Customizable duration and positioning
- 🎪 Rich colors and close buttons

## Usage

### Basic Usage

```tsx
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

// Simple message
toast("Event has been created.");

// With options
toast({
    title: "Success!",
    description: "Your changes have been saved.",
    variant: "success"
});
```

### Toast Types

```tsx
// Success
toast({
    title: "Success!",
    variant: "success"
});

// Error
toast({
    title: "Error occurred",
    variant: "destructive"
});

// Warning
toast({
    title: "Warning",
    variant: "warning"
});

// Info
toast({
    title: "Information",
    variant: "info"
});

// Default
toast({
    title: "Default message",
    variant: "default"
});
```

### Advanced Usage

```tsx
toast({
    title: "Action Required",
    description: "Please confirm your email address",
    variant: "warning",
    action: {
        label: "Confirm",
        onClick: () => console.log("Confirmed!")
    }
});
```

## Configuration

The Toaster component is configured in `app-sidebar-layout.tsx` with:

- **Position**: Top-right
- **Theme**: Auto-detects light/dark mode
- **Duration**: 4 seconds default
- **Rich Colors**: Enabled for better visual feedback
- **Close Button**: Enabled for manual dismissal

## API Reference

For complete API documentation, see:
- [Sonner Official API](https://sonner.emilkowalski.ski/api)
- [Shadcn UI Sonner Docs](https://ui.shadcn.com/docs/components/radix/sonner)

## Examples in Codebase

- **Martyrs Edit**: Success toast on update
- **Martyrs Create**: Success toast on creation
- **Export Notifications**: Progress and completion toasts
- **Row Selection**: Count notifications
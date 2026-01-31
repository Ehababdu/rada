// Type declarations for @shadcn/ui (CLI tool)
// This package is a CLI helper (not a React component library).
// We provide a small, precise declaration for the parts used by the CLI.

declare module '@shadcn/ui' {
    import type { Command } from 'commander';

    export type Component = any;

    export type AddOptions = {
        components: Component[];
        dir: string;
    };

    /**
     * Entry point used by the package's binary. Runs the CLI.
     */
    export function main(): Promise<void>;

    /**
     * Prompts the user for add options and returns the selection.
     */
    export function promptForAddOptions(): Promise<AddOptions>;

    /**
     * The underlying commander `program` instance used by the CLI.
     */
    export const program: Command;

    export default {
        main,
        promptForAddOptions,
        program,
    } as {
        main: typeof main;
        promptForAddOptions: typeof promptForAddOptions;
        program: typeof program;
    };
}

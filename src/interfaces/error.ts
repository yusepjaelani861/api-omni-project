export interface ErrorProps {
    message: string;
    status: number;
    data: [] | null;
    error: {
        error_code: string;
        error_data: Array<[]> | [];
    }
    stack: string;
}
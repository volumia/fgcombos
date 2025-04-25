export enum Status {
    Success,
    Error
}

export type StatusMessage = {
    text: string;
    type: Status;
};
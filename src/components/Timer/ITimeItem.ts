/**
 * Interface for a timed interval item
 *
 * @time {number} Item time in seconds
 * @label {string} Item name to be displayed
 * @alert {boolean} Whether to play a sound when timed out
 */
export interface ITimeItem{
    id?: string,
    time: number,
    label: string,
    alert: boolean
}

export interface ITimeItems extends Array<ITimeItem> {}
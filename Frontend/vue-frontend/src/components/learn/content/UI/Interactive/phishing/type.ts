export interface TooltipData {
    id: string
    title: string
    description: string
    x: number
    y: number
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
}
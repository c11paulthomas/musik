export interface IRouteObject {
    label?: string
    path: string
    icon?: JSX.Element
}

export interface IMenuItemProps {
    route: IRouteObject
    current: boolean
}
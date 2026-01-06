export type PathItem = {
    label: string;
    href: string;
}

let path = $state<PathItem[]>([]);

export function getPath() {
    return path;
}

export function addPathItem(item: PathItem) {
    path.push(item);
    return path.length - 1;
}

export function removePathItem(href: string) {
    path = path.filter((item) => item.href !== href);
}

export function updatePathItem(index: number, props: PathItem) {
    path[index] = props;
}
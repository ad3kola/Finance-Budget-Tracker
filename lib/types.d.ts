export interface StatsProps {
    title: string,
    value: number,
    Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    roi: number,
    valueChange: number,
}
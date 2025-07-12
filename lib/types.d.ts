
export interface StatsProps {
  title: string;
  value: number;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  roi: number;
  valueChange: number;
}

export interface CategoryItem {
  name: string;
  Icon: LucideIcon;
}

export interface CategoryMap {
  Income: CategoryItem[];
  Expense: CategoryItem[];
}

export interface TransactionsProps {
  amount: number;
  category: {
    name: string
    Icon: string
  } | null;
  created_at: string;
  date: string;
  description: string;
  id: number;
  type: string;
  user_id: string;
}

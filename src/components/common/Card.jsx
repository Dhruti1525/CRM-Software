export default function Card({ children, className = '', as: Comp = 'div', ...rest }) {
  return (
    <Comp
      className={`bg-white dark:bg-surface-dark rounded-xl2 border border-slate-100 dark:border-navy-700 shadow-card dark:shadow-card-dark ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  )
}

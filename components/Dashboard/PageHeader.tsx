interface PageHeaderProps {
    title: string;
    children?: React.ReactNode;
  }
  
  export const PageHeader = ({ title, children }: PageHeaderProps) => {
    return (
      <header className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">
            {title}
        </h1>
          <div className="flex items-center gap-4">
            {children}
          </div>
        </div>
        </div>
      </header>
    );
  };
  
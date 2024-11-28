// components/shared/PageHeader.tsx
interface PageHeaderProps {
    title: string;
    children?: React.ReactNode;
  }
  
  export const PageHeader = ({ title, children }: PageHeaderProps) => {
    return (
      <header className="bg-white shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <div className="flex items-center gap-4">
            {children}
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <i className="fas fa-sun"></i>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <i className="fas fa-bell"></i>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };
  
interface CustomToastProps {
    title: string;
    subtitle: string;
}

const CustomToast= ({ title, subtitle }: CustomToastProps) => {
    return (
        <div className="flex items-center text-left py-2">
            <div className="ml-3">
                <p className="text-base font-bold text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
};

export default CustomToast;

const TeacherSettingsTab = ({ Tab }: { Tab: () => string }) => {

    return (
        <>  
            {Tab() === "settings" && (
                <div className="p-6 space-y-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-600">This is the settings tab content.</p>
                </div>
            )}
        </>
    );
}

export default TeacherSettingsTab;

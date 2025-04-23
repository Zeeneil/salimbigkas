
const AdminPronunciationTab = ({ Tab }: { Tab: () => string }) => {

    return (
        <>
            {Tab() === "pronunciation" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Pronunciation Exercises
                  </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-1 flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div>
                    <div>
                      <h2 className="font-medium">Pronunciation Management</h2>
                      <h2 className="text-gray-500">Manage pronunciation exercises across the platform</h2>
                    </div>
                    <div className="space-y-4 mt-5">
                      <p>Pronunciation management interface would go here.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}

export default AdminPronunciationTab;
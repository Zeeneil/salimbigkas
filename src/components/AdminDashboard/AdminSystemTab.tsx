
const AdminSystemTab = ({ Tab }: { Tab: () => string }) => {

    const systemStatus = [
        {
          id: 1,
          name: "Database",
          status: "Operational",
          uptime: "99.9%",
          color: "green",
        },
        {
          id: 2,
          name: "API Services",
          status: "Operational",
          uptime: "99.7%",
          color: "green",
        },
        {
          id: 3,
          name: "Storage",
          status: "Operational",
          uptime: "99.8%",
          color: "green",
        },
        {
          id: 4,
          name: "Authentication",
          status: "Operational",
          uptime: "99.9%",
          color: "green",
        },
    ];

    return (
        <>
            {Tab() === "system" && (
              <div className="space-y-6 ">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    System Management
                  </h1>
                </div>

                <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div>
                    <h2 className="font-medium">System Status</h2>
                    <h2 className="text-gray-400">Current status of platform services</h2>
                  </div>
                  <div className="w-full space-y-4 mt-5">
                    {systemStatus.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between px-6 py-3 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              service.color === "green" ? "bg-green-500" :
                              service.color === "red" ? "bg-red-500" :
                              service.color === "yellow" ? "bg-yellow-500" : "bg-gray-500"
                            }`}
                          />
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground text-gray-500">
                              Uptime: {service.uptime}
                            </p>
                          </div>
                        </div>
                        <div
                          className="rounded-sm px-2 py-1 text-xs font-medium text-green-500 border border-green-200 bg-green-50"
                        >
                          {service.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div>
                    <h2 className="font-medium">System Configuration</h2>
                    <h2 className="text-gray-400">Manage platform settings</h2>
                  </div>
                  <div className="space-y-4 mt-5">
                    <p>System configuration interface would go here.</p>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}

export default AdminSystemTab;
const TeacherMessagesTab = ({ Tab }: { Tab: () => string }) => {
  return (
    <>
      {Tab() === "messages" && (
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-gray-600">This is the messages tab content.</p>
        </div>
      )}
    </>
  );
};

export default TeacherMessagesTab;

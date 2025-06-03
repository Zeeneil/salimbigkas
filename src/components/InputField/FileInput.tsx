import React, { useRef } from 'react';
import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from "../../firebase/firebase";
import { X } from 'lucide-react';

type FileInputProps = {
    label: string;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    setFileUrls: React.Dispatch<React.SetStateAction<string[]>>;
    disabled: boolean;
    accept?: string;
    inputId: string;
    classGrade: string;
};

const FileInput = ({
    label,
    files,
    setFiles,
    setFileUrls,
    disabled,
    accept = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mov,.webm",
    inputId,
    classGrade,
}: FileInputProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");
        const newFiles = Array.from(e.target.files || []);
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "video/mp4",
            "video/webm",
            "video/mov",
        ];
        if (files.length + newFiles.length > 3) {
            setErrorMessage("You can only upload up to 3 files.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        for (const file of newFiles) {
            if (!allowedTypes.includes(file.type)) {
                setErrorMessage("Unsupported file type.");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
        }
        const urls: string[] = [];
        for (const file of newFiles) {
            const filePath = `lessons/${classGrade}/${Date.now()}_${file.name}`;
            const fileRef = ref(storage, filePath);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            urls.push(url);
        }
        setFiles(prev => [...prev, ...newFiles]);
        setFileUrls(prev => [...prev, ...urls]);
        if (fileInputRef?.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemove = async (idx: number) => {
        // Remove file from Firebase Storage if URL exists
        setFiles(prev => prev.filter((_, i) => i !== idx));
        setFileUrls(prevUrls => {
            const urlToDelete = prevUrls[idx];
            if (urlToDelete) {
                // Get the storage reference from the URL
                try {
                    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";
                    if (urlToDelete.startsWith(baseUrl)) {
                        // Extract the path after '/o/' and before '?'
                        const pathMatch = urlToDelete.match(/\/o\/(.+)\?/);
                        if (pathMatch && pathMatch[1]) {
                            const filePath = decodeURIComponent(pathMatch[1]);
                            const fileRef = ref(storage, filePath);
                            deleteObject(fileRef).catch(() => {});
                        }
                    }
                } catch (err) {
                    console.error("Error deleting file from Firebase Storage:", err);
                }
            }
            return prevUrls.filter((_, i) => i !== idx);
        });
        if (fileInputRef?.current) fileInputRef.current.value = "";
    };

    return (
        <div className="text-left relative mb-2">
            <input
                ref={fileInputRef}
                disabled={disabled}
                type="file"
                id={inputId}
                name={inputId}
                multiple
                accept={accept}
                className="hidden"
                onChange={handleFileUpload}
            />
            <label
                htmlFor={inputId}
                className={`block w-full border rounded-sm cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${files.length > 0 ? 'border-[#2C3E50] p-2' : 'border-gray-300 p-4'} bg-white flex items-center`}
                tabIndex={0}
                onKeyDown={e => {
                    e.preventDefault();
                    if (e.key === 'Enter' || e.key === ' ') {
                        document.getElementById(inputId)?.click();
                    }
                }}
            >
                {files.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {files.map((file, idx) => (
                            <span
                                key={idx}
                                className="flex items-stretch rounded bg-[#2C3E50] border border-[#b3c6e7] text-white text-sm font-medium shadow-sm"
                            >
                                <span className="flex items-center gap-1 p-4">
                                    <span className="truncate max-w-[120px]" title={file.name}>
                                        {file.name}
                                    </span>
                                    <span className="text-gray-300 text-xs">
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    title="Tanggalin ang file"
                                    className="flex self-stretch items-center p-2 bg-red-500/90 text-xs text-white font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all border border-red-400 shadow-sm"
                                    onClick={e => {
                                        e.preventDefault();
                                        handleRemove(idx);
                                    }}
                                    aria-label={`Tanggalin ang ${file.name}`}
                                    tabIndex={-1}
                                >
                                    <X className="inline" size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-500">{label}</span>
                )}
            </label>
            {errorMessage && (
                <div className="text-red-600 text-xs mt-1">{errorMessage}</div>
            )}
        </div>
    );
};

export default FileInput;
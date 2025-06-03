
import { useEffect, useState, useRef, MouseEvent, JSX } from "react";
import { storage, ref, uploadBytes, getDownloadURL, deleteObject } from "../../firebase/firebase";
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import CustomToast from "../Toast/CustomToast";
import { ChevronLeft, ChevronDown, CircleAlert, ZoomIn, ZoomOut } from 'lucide-react';
import { SpinLoadingWhite } from "../Icons/icons";
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface YunitLessonProps {
    setShowLessonForm: () => void;
    yunitData?: any;
    callFetchLessons?: any;
    classGrade: string;
}

const LessonForm = ({ setShowLessonForm, yunitData, callFetchLessons, classGrade }: YunitLessonProps) => {
    
    const { currentUser } = useAuth();
    const [aralinNumero, setAralinNumero] = useState<string>("");
    const [aralinUri, setAralinUri] = useState<string>("");
    const [aralinPamagat, setAralinPamagat] = useState<string>("");
    const [aralinPaglalarawan, setAralinPaglalarawan] = useState<string>("");
    const [aralinNilalaman, setAralinNilalaman] = useState<string>("");
    const [aralinContent, setAralinContent] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [ayRehistro, setAyRehistro] = useState<boolean>(false);

    const [textPreview, setTextPreview] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [zoom, setZoom] = useState<number>(2.5);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        setNumPages(numPages);
    }

    useEffect(() => {
        if (aralinContent) {
            const url = URL.createObjectURL(aralinContent);
            setFileUrl(url);
            return () => {
                URL.revokeObjectURL(url);
                setFileUrl(null);
            };
        }
    }, [aralinContent]);

    const handleRegister = async (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!ayRehistro) {
            setAyRehistro(true);
            try {
                const filePath = `lessons/${classGrade}/${Date.now()}_${aralinContent?.name}`;
                const fileRef = ref(storage, filePath);
                await uploadBytes(fileRef, aralinContent? aralinContent : new Blob([aralinNilalaman]));
                toast.success(<CustomToast title="Aralin successfully registered!" subtitle="Your lesson has been successfully registered."/>)
                setAyRehistro(false);
            } catch (error) {
                console.error("Error uploading file:", error);
                setAyRehistro(false);
                return;
            }
        }
    }

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="flex items-center p-6 border-b-2 border-[#BDC3C7]">
                    <motion.button
                        type="button"
                        className="flex text-2xl hover:text-gray-600 font-bold items-center bg-none transition duration-200 ease-in-out"
                        onClick={setShowLessonForm}
                        aria-label="back to classes"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="mr-2" size={24} />
                        <h1 className="tracking-tight">
                            {yunitData?.title ? yunitData.title : "Bagong Aralin"}
                        </h1>
                    </motion.button>
                </div>
                <div className="flex flex-col p-6">
                    <div className="rounded-xl border-1 border-gray-200 shadow-sm p-8">
                        {/* Error message display */}
                        {errorMessage &&
                            <motion.div
                                className="relative flex mb-6 py-5 px-15 bg-[#FBE6E6] text-sm justify-center items-center rounded-sm shadow-sm drop-shadow-sm"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CircleAlert className="absolute left-4 text-red-600" size={24} />
                                <p>{errorMessage}</p>
                            </motion.div>
                        }
                        {/* Registration form */}
                        <form onSubmit={handleRegister}>
                            <div className="flex text-left mb-5 justify-between items-center">
                                <h3 className="text-sm text-gray-600 mb-4">Mangyaring punan ang mga detalye sa ibaba upang magrehistro ng isang bagong aralin.</h3>
                                <div className="flex gap-5 items-center">
                                    {/* Register button */}
                                    <button
                                        type="submit"
                                        className={`bg-[#2C3E50] text-lg text-white px-20 py-3 rounded-lg shadow-md drop-shadow-lg ${ayRehistro ? 'opacity-50 cursor-not-allowed' : 'hover:font-medium hover:border-[#386BF6] hover:bg-[#34495e]'}`}
                                        disabled={ayRehistro}
                                    >
                                        {ayRehistro ? 
                                            <div className="flex items-center justify-center gap-2">
                                                <SpinLoadingWhite />
                                                Processing...
                                            </div>
                                        : 
                                            'Isumite'
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-1 gap-4">
                                {/* Lesson Number input */}
                                <div className="mt-4 mb-2 text-left relative">
                                    <input
                                        disabled={ayRehistro}
                                        name='aralinNumero'
                                        type="text"
                                        id="aralinNumero"
                                        autoComplete="aralinNumero"
                                        required
                                        autoFocus
                                        minLength={1}
                                        maxLength={30}
                                        className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinNumero ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                        placeholder=" "
                                        value={aralinNumero}
                                        onChange={(e) => setAralinNumero(e.target.value)}
                                        // Restrict input to letters and spaces only
                                        onKeyDown={(e) => {
                                            setErrorMessage('');
                                            if (!/^\d*$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                                e.preventDefault();
                                                setErrorMessage('Please enter a valid number.');
                                                return;
                                            }
                                        }}
                                    />
                                    <label
                                        className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinNumero ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                        htmlFor="aralinNumero">
                                        Numero ng Aralin
                                    </label>
                                </div>
                                {/* Class Name input */}
                                <div className="text-left relative">
                                    <input
                                        disabled={ayRehistro}
                                        name='classname'
                                        type="text"
                                        id="classname"
                                        autoComplete="classname"
                                        required
                                        autoFocus
                                        minLength={1}
                                        maxLength={30}
                                        className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinPamagat ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                        placeholder=" "
                                        value={aralinPamagat}
                                        onChange={(e) => setAralinPamagat(e.target.value)}
                                        // Restrict input to letters and spaces only
                                        onKeyDown={() => {
                                            setErrorMessage('');
                                        }}
                                    />
                                    <label
                                        className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinPamagat ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                        htmlFor="classname">
                                        Pamagat ng Aralin
                                    </label>
                                </div>
                                {/* Uri ng Aralin*/}
                                <div className="text-left relative">
                                    <div className="relative">
                                        <select
                                            disabled={ayRehistro}
                                            title="Uri ng Aralin"
                                            name='Uri ng Aralin'
                                            id="Uri-ng-Aralin"
                                            required
                                            className={`w-full p-4 pr-12 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none appearance-none ${aralinUri? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                            value={aralinUri}
                                            onChange={(e) => setAralinUri(e.target.value)}
                                        >
                                            <option value=""></option>
                                            <option value="Pagbasa">Pagbasa</option>
                                            <option value="Gramatika">Gramatika</option>
                                            <option value="Pagpapahalaga">Pagpapahalaga</option>
                                        </select>
                                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <ChevronDown size={20} />
                                        </span>
                                        <label
                                            className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinUri ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                            htmlFor="Uri-ng-Aralin"
                                        >
                                            Uri ng Aralin
                                        </label>
                                    </div>
                                </div>
                                {/* Description */}
                                <div className="text-left relative">
                                    <textarea
                                        disabled={ayRehistro}
                                        name='description'
                                        id="description"
                                        autoComplete="description"
                                        required
                                        minLength={1}
                                        rows={4}
                                        className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinPaglalarawan ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                        placeholder=" "
                                        value={aralinPaglalarawan}
                                        onChange={(e) => setAralinPaglalarawan(e.target.value)}
                                        onKeyDown={() => {
                                            setErrorMessage('');
                                        }}
                                    />
                                    <label
                                        className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinPaglalarawan ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                        htmlFor="description"
                                    >
                                        Paglalarawan
                                    </label>
                                </div>
                                {/* Nilalaman ng aralin */}
                                <div className="text-left relative">
                                    <textarea
                                        disabled={ayRehistro}
                                        title="Nilalaman ng aralin"
                                        name='Nilalaman ng aralin'
                                        id="Nilalaman-ng-aralin"
                                        autoComplete="Nilalaman ng aralin"
                                        required={!aralinContent}
                                        minLength={200}
                                        rows={8}
                                        className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinNilalaman ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                        placeholder=" "
                                        value={aralinNilalaman}
                                        onChange={(e) => setAralinNilalaman(e.target.value)}
                                        onKeyDown={() => {
                                            setErrorMessage('');
                                        }}
                                    />
                                    <label
                                        className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${aralinNilalaman ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                        htmlFor="Nilalaman ng aralin"
                                    >
                                        Nilalaman ng Aralin
                                    </label>
                                </div>
                                {/* or divider  */}
                                <div className='flex flex-row w-full'>
                                    <div className='border-b-1 mb-2.5 mr-2 w-full border-gray-200'></div>
                                    <div className='text-sm mb-0.5 w-fit text-gray-500'>or</div>
                                    <div className='border-b-2 mb-2.5 ml-2 w-full border-gray-200'></div>
                                </div>
                                {/* Content Upload */}
                                <div className="text-left relative">
                                    <input
                                        disabled={ayRehistro}
                                        type="file"
                                        id="aralinContent"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                                        required={!aralinNilalaman}
                                        className={`hidden w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinContent ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                        placeholder=""
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const allowedTypes = [
                                                    "application/pdf",
                                                    // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                    // "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                    // "text/plain"
                                                ];
                                                if (!allowedTypes.includes(file.type)) {
                                                    setErrorMessage("Unsupported file type.");
                                                    return;
                                                }
                                                setAralinContent(file);
                                                setErrorMessage('');
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="aralinContent"
                                        className={`block w-full p-4 border rounded-sm cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none ${aralinContent ? 'border-[#2C3E50]' : 'border-gray-300'} bg-white`}
                                        tabIndex={0}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                document.getElementById('aralinContent')?.click();
                                            }
                                        }}
                                    >
                                        {aralinContent ? aralinContent.name : "I-upload ang Nilalaman ng Aralin (hal. PDF)"}
                                    </label>
                                </div>
                                {/* show the preview of the file */}
                                {aralinContent && aralinContent.type === "application/pdf" && fileUrl && (
                                    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-semibold text-[#2C3E50]">PDF Preview</span>
                                            <span className="text-xs text-gray-500">
                                                {aralinContent.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-center bg-white rounded-md shadow-inner p-2">
                                            <Document
                                                file={fileUrl}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                loading={<span className="text-gray-400">Loading PDF preview...</span>}
                                                error={<span className="text-red-500">Failed to load PDF.</span>}
                                            >
                                                <Page pageNumber={pageNumber} scale={zoom} width={400} renderTextLayer={false} renderAnnotationLayer={false} />
                                            </Document>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    disabled={pageNumber <= 1}
                                                    onClick={() => setPageNumber(pageNumber - 1)}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                                        pageNumber <= 1
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-[#2C3E50] text-white hover:bg-[#34495e]"
                                                    }`}
                                                    aria-label="Previous page"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={pageNumber >= (numPages || 1)}
                                                    onClick={() => setPageNumber(pageNumber + 1)}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                                        pageNumber >= (numPages || 1)
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-[#2C3E50] text-white hover:bg-[#34495e]"
                                                    }`}
                                                    aria-label="Next page"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                {/* Zoom controls */}
                                                <div className="flex space-x-4 items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setZoom(z => Math.max(0.5, Math.round((z - 0.25) * 100) / 100))}
                                                        className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                                        aria-label="Zoom out"
                                                        disabled={zoom <= 0.5}
                                                    >
                                                        <ZoomOut size={18} />
                                                    </button>
                                                    <span className="text-sm text-center">{Math.round(zoom * 100)}%</span>
                                                </div>
                                                <Popup
                                                    trigger={
                                                        <button
                                                            type="button"
                                                            className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                                            aria-label="Zoom in"
                                                            tabIndex={0}
                                                        >
                                                            <ZoomIn size={18} />
                                                        </button>
                                                    }
                                                    position={["bottom left", "top left"]}
                                                    closeOnDocumentClick
                                                    arrow={false}
                                                    contentStyle={{ padding: "0.5rem", border: 'none', borderRadius: "0.5rem", minWidth: "180px", background: 'transparent', boxShadow: 'none' }}
                                                    nested
                                                    lockScroll
                                                    children={((close: () => void) => (
                                                        <motion.div 
                                                            className="flex flex-col bg-white shadow-xl rounded-lg mt-2 border border-gray-200 focus:outline-none"
                                                            tabIndex={-1}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') close();
                                                            }}
                                                        >
                                                            <div className="flex flex-col gap-1 p-2">
                                                                <button
                                                                    type="button"
                                                                    className={`px-3 py-2 rounded text-sm text-left transition ${zoom === 2.5 ? "bg-[#2C3E50] text-white font-semibold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                                                                    onClick={() => {
                                                                        setZoom(2.5);
                                                                        close();
                                                                    }}
                                                                >
                                                                    Fit to Window
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`px-3 py-2 rounded text-sm text-left transition ${zoom === 0.75 ? "bg-[#2C3E50] text-white font-semibold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                                                                    onClick={() => {
                                                                        setZoom(0.75);
                                                                        close();
                                                                    }}
                                                                >
                                                                    75%
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`px-3 py-2 rounded text-sm text-left transition ${zoom === 1 ? "bg-[#2C3E50] text-white font-semibold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                                                                    onClick={() => {
                                                                        setZoom(1);
                                                                        close();
                                                                    }}
                                                                >
                                                                    100%
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`px-3 py-2 rounded text-sm text-left transition ${zoom === 1.25 ? "bg-[#2C3E50] text-white font-semibold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                                                                    onClick={() => {
                                                                        setZoom(1.25);
                                                                        close();
                                                                    }}
                                                                >
                                                                    125%
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`px-3 py-2 rounded text-sm text-left transition ${zoom === 1.5 ? "bg-[#2C3E50] text-white font-semibold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                                                                    onClick={() => {
                                                                        setZoom(1.5);
                                                                        close();
                                                                    }}
                                                                >
                                                                    150%
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`px-3 py-2 rounded text-sm text-left transition ${zoom === 2 ? "bg-[#2C3E50] text-white font-semibold" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                                                                    onClick={() => {
                                                                        setZoom(2);
                                                                        close();
                                                                    }}
                                                                >
                                                                    200%
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )) as any}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                Page <span className="font-semibold">{pageNumber}</span> of <span className="font-semibold">{numPages}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default LessonForm;
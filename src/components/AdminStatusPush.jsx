import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Check, UploadCloud, Loader2 } from "lucide-react";

/**
 * AdminPushStatusComponent
 * Props:
 *  - shipmentId (number|string) required
 *  - onSuccess (fn) optional: called with the server response when push succeeds
 *
 * Notes:
 *  - Expects backend endpoint: POST `${VITE_API_URL}/api/progress/push-status`
 *    with body as multipart/form-data containing: shipmentId, title, description, pdf (file), image (file)
 *  - Sends Authorization Bearer token from localStorage.getItem('token')
 */

export default function AdminPushStatusComponent({ shipmentId, onSuccess }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pdfFile, setPdfFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setPdfFile(null);
        setImageFile(null);
        setUploadProgress(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!shipmentId) {
            setError("Missing shipmentId. Provide a valid shipmentId to the component.");
            return;
        }
        if (!title.trim() || !description.trim()) {
            setError("Title and description are required.");
            return;
        }

        const form = new FormData();
        form.append("shipmentId", shipmentId);
        form.append("title", title.trim());
        form.append("description", description.trim());
        if (pdfFile) form.append("pdf", pdfFile);
        if (imageFile) form.append("image", imageFile);

        setLoading(true);

        try {
            console.log(form)
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/progress/status-update`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percent);
                        }
                    },
                }
            );

            if (res.data && res.data.success) {
                setSuccessMsg(res.data.message || "Status pushed successfully");
                clearForm();
                if (typeof onSuccess === "function") onSuccess(res.data);
            } else {
                setError(res.data?.message || "Unexpected server response");
            }
        } catch (err) {
            console.error("Error pushing status:", err);
            const msg = err?.response?.data?.message || err.message || "Network error";
            setError(msg);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Card className="rounded-2xl shadow-md border border-slate-200 max-w-2xl">
            <CardContent>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Push Shipment Status</h3>
                <p className="text-sm text-slate-500 mb-4">Add a new status update for shipment <span className="font-medium">{shipmentId}</span>.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Advance Payment received" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Provide details about this status"
                            className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-slate-400 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col text-sm text-slate-700">
                            <span className="font-medium mb-1">Image (optional)</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            />
                            {imageFile && <span className="text-xs mt-1 text-slate-500">Selected: {imageFile.name}</span>}
                        </label>

                        <label className="flex flex-col text-sm text-slate-700">
                            <span className="font-medium mb-1">PDF (optional)</span>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            />
                            {pdfFile && <span className="text-xs mt-1 text-slate-500">Selected: {pdfFile.name}</span>}
                        </label>
                    </div>

                    {uploadProgress > 0 && (
                        <div className="w-full bg-slate-100 rounded-full overflow-hidden h-2">
                            <div style={{ width: `${uploadProgress}%` }} className="h-2 bg-slate-700"></div>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <Check className="h-4 w-4" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloud className="h-4 w-4" />
                                    <span>Push Status</span>
                                </>
                            )}
                        </Button>

                        <Button type="button" variant="ghost" onClick={clearForm} disabled={loading}>
                            Clear
                        </Button>
                    </div>
                </form>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-xs text-slate-500">
                    <p>Notes:</p>
                    <ul className="list-disc ml-5">
                        <li>Signed preview URLs will be generated by the backend (frontend only receives preview links for a short time).</li>
                        <li>Make sure the admin token is stored in localStorage under <code>token</code>.</li>
                    </ul>
                </motion.div>
            </CardContent>
        </Card>
    );
}

AdminPushStatusComponent.propTypes = {
    shipmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onSuccess: PropTypes.func,
};

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CircularBtn from "../../components/circularBtn";
import CandidHeading from "../../components/candidHeader";
import { useCandidContext } from "../../context/storeContext";
import "./photoEditorStyling.css";

interface FilterSettings {
    exposure: number;
    contrast: number;
    temperature: number;
    smoothing: number;
    saturation: number;
    preset: "none" | "warm" | "cool" | "mono";
}

const defaultFilterSettings: FilterSettings = {
    exposure: 0,
    contrast: 100,
    temperature: 0,
    smoothing: 0,
    saturation: 100,
    preset: "none",
};

const PhotoEditor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setEditorSettings } = useCandidContext();

    const photoUrls: string[] = location.state?.photos || [];

    const allPhotos = useMemo(
        () => photoUrls.map((url, index) => ({ url, index })).filter(photo => photo.url),
        [photoUrls]
    );

    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(allPhotos[0]?.index ?? 0);
    const [filters, setFilters] = useState<Record<number, FilterSettings>>(() => {
        const initial: Record<number, FilterSettings> = {};
        allPhotos.forEach(photo => {
            initial[photo.index] = { ...defaultFilterSettings };
        });
        return initial;
    });

    // Mảng ảnh đã chỉnh
    const [editedPhotos, setEditedPhotos] = useState<string[]>(photoUrls);

    const currentPhoto = photoUrls[currentPhotoIndex] || "";
    const currentFilter = filters[currentPhotoIndex] || defaultFilterSettings;

    const updateFilter = (key: keyof FilterSettings, value: number | string) => {
        setFilters(prev => ({
            ...prev,
            [currentPhotoIndex]: {
                ...((prev[currentPhotoIndex] || defaultFilterSettings) as FilterSettings),
                [key]: value,
            },
        }));
    };

    const buildFilter = (settings: FilterSettings) => {
        const exposure = 1 + settings.exposure / 100;
        const contrast = settings.contrast / 100;
        const saturation = settings.saturation / 100;
        const temperature = settings.temperature;
        const sepia = temperature >= 0 ? temperature / 200 : 0;
        const hue = temperature >= 0 ? 10 : -10;
        const tempSaturate = 1 + Math.abs(temperature) / 400;
        const smooth = settings.smoothing * 0.4;
        let presetFilter = "";

        if (settings.preset === "warm") presetFilter = "sepia(0.18) saturate(1.2) hue-rotate(5deg)";
        if (settings.preset === "cool") presetFilter = "sepia(0.02) saturate(0.92) hue-rotate(-10deg)";
        if (settings.preset === "mono") presetFilter = "grayscale(0.92) contrast(1.05)";

        return `brightness(${exposure}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia}) hue-rotate(${hue}deg) saturate(${tempSaturate}) blur(${smooth}px) ${presetFilter}`;
    };

    // Hàm áp dụng filter lên ảnh gốc bằng canvas
    const applyFilterToImage = (src: string, filter: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.filter = filter;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    resolve(canvas.toDataURL("image/png"));
                }
            };
        });
    };

    // Tự động lưu mỗi khi filter thay đổi
    useEffect(() => {
        const saveCurrent = async () => {
            if (!currentPhoto) return;
            const editedUrl = await applyFilterToImage(currentPhoto, buildFilter(currentFilter));
            const updated = [...editedPhotos];
            updated[currentPhotoIndex] = editedUrl;
            setEditedPhotos(updated);
            setEditorSettings({ editedPhotoIndex: currentPhotoIndex, editedPhotoUrl: editedUrl });
        };
        saveCurrent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, currentPhotoIndex]);

    const handleComplete = () => {
        navigate("/polaroid", { state: { editedPhotos } });
    };

    const handleCancel = () => {
        navigate("/polaroid", { state: { editedPhotos: photoUrls } });
    };

    const handleBack = () => { navigate(-1); };

    if (!photoUrls.length || !allPhotos.length) {
        return (
            <div className="photo-editor-page">
                <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
                <CandidHeading text="CHỈNH SỬA ẢNH" />
                <div className="photo-editor-empty">
                    <p>Không có ảnh nào để chỉnh sửa. Vui lòng quay lại trang chọn ảnh và chọn ít nhất một ảnh.</p>
                    <CircularBtn
                        onClick={() => navigate("/polaroid")}
                        buttonText="Quay lại chọn ảnh"
                        iconUrl="/assets/images/png/back_icon.png"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="photo-editor-page">
            <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
            <CandidHeading text="CHỈNH SỬA ẢNH" />
            <div className="editor-layout">
                <aside className="editor-sidebar">
                    <div className="editor-sidebar-section">
                        <h3>Danh sách ảnh</h3>
                        <div className="editor-thumbnail-row">
                            {allPhotos.map(photo => (
                                <button
                                    key={photo.index}
                                    className={`thumbnail-btn ${photo.index === currentPhotoIndex ? "active" : ""}`}
                                    onClick={() => setCurrentPhotoIndex(photo.index)}
                                >
                                    <img src={photo.url} alt={`Photo ${photo.index + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="editor-sidebar-section">
                        <h3>Bộ lọc màu</h3>
                        <select
                            value={currentFilter.preset}
                            onChange={(e) => updateFilter("preset", e.target.value)}
                        >
                            <option value="none">Không</option>
                            <option value="warm">Ấm</option>
                            <option value="cool">Mát</option>
                            <option value="mono">Đơn sắc</option>
                        </select>
                    </div>

                    <div className="editor-sidebar-section">
                        <h3>Điều chỉnh</h3>
                        <label>Exposure: {currentFilter.exposure}</label>
                        <input
                            type="range"
                            min="-50"
                            max="50"
                            value={currentFilter.exposure}
                            onChange={(e) => updateFilter("exposure", Number(e.target.value))}
                        />
                        <label>Contrast: {currentFilter.contrast}%</label>
                        <input
                            type="range"
                            min="50"
                            max="150"
                            value={currentFilter.contrast}
                            onChange={(e) => updateFilter("contrast", Number(e.target.value))}
                        />
                        <label>Temperature: {currentFilter.temperature}</label>
                        <input
                            type="range"
                            min="-100"
                            max="100"
                            value={currentFilter.temperature}
                            onChange={(e) => updateFilter("temperature", Number(e.target.value))}
                        />
                        <label>Saturation: {currentFilter.saturation}%</label>
                        <input
                            type="range"
                            min="50"
                            max="150"
                            value={currentFilter.saturation}
                            onChange={(e) => updateFilter("saturation", Number(e.target.value))}
                        />
                        <label>Skin smoothing: {currentFilter.smoothing}</label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={currentFilter.smoothing}
                            onChange={(e) => updateFilter("smoothing", Number(e.target.value))}
                        />
                    </div>

                    <div className="editor-sidebar-actions">
                        <button className="editor-complete-btn" onClick={handleComplete}>
                            Hoàn tất
                        </button>
                        <button className="editor-cancel-btn" onClick={handleCancel}>
                            Hủy
                        </button>
                    </div>
                </aside>

                <main className="editor-preview-panel">
                    <div className="editor-preview-frame">
                        <img
                            src={currentPhoto}
                            alt="Edited preview"
                            className="editor-preview-image"
                            style={{ filter: buildFilter(currentFilter) }}
                        />
                    </div>
                    <div className="editor-preview-caption">
                        <p>Ảnh {currentPhotoIndex + 1} đang chỉnh sửa</p>
                        <p>Mọi thay đổi sẽ tự động lưu vào tiến trình.
                            Khi hoàn tất, nhấn nút Hoàn tất để quay lại trang chọn ảnh.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PhotoEditor;

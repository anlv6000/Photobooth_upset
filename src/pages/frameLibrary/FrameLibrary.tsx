import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidContext, FrameComponent, FrameCluster, EventFramePreset } from "../../context/storeContext";
import "./frameLibraryStyling.css";

const { ipcRenderer } = (window as any).require ? (window as any).require("electron") : { ipcRenderer: null };

const FrameLibrary = () => {
    const navigate = useNavigate();
    const { frameComponents, setFrameComponents, frameClusters, setFrameClusters, eventFrames, setSelectedEventPreset, setEventFrames, setMode } = useCandidContext();

    const [selectedCluster, setSelectedCluster] = useState<string>("");
    const [newClusterName, setNewClusterName] = useState<string>("");
    const [layoutChoice, setLayoutChoice] = useState<string>("1");
    const [selectedHeader, setSelectedHeader] = useState<string>("");
    const [selectedFooter, setSelectedFooter] = useState<string>("");
    const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
    const [uploadType, setUploadType] = useState<'header' | 'footer' | 'background'>("header");
    const [presetName, setPresetName] = useState<string>("");
    const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; title: string; message: string; onConfirm: () => void }>({ show: false, title: "", message: "", onConfirm: () => {} });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const layoutPhotoCount: Record<string, number> = {
        "1": 1,
        "2strip": 2,
        "3strip": 3,
        "4strip": 4,
        "6square": 6,
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !selectedCluster || !ipcRenderer) return;

        for (const file of Array.from(files)) {
            const reader = new FileReader();
            const dataUrl: string = await new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    const src = e.target?.result as string;
                    if (src) resolve(src);
                    else reject(new Error("Unable to read file."));
                };
                reader.onerror = () => reject(new Error("Unable to read file."));
                reader.readAsDataURL(file);
            });

            const componentType = uploadType;
            const savedSrc = await ((window as any).electronAPI ? (window as any).electronAPI.saveFrameFile({
                type: componentType,
                clusterId: selectedCluster,
                fileName: file.name,
                dataUrl,
            }) : ipcRenderer.invoke("save-frame-file", {
                type: componentType,
                clusterId: selectedCluster,
                fileName: file.name,
                dataUrl,
            }));

            const newComponent: FrameComponent = {
                id: `${componentType}-${Date.now()}-${Math.random()}`,
                name: file.name,
                type: componentType,
                src: savedSrc,
            };

            setFrameComponents(prev => [...prev, newComponent]);

            setFrameClusters(prev => prev.map(cluster =>
                cluster.id === selectedCluster
                    ? {
                        ...cluster,
                        [componentType === 'header' ? 'headers' : componentType === 'footer' ? 'footers' : 'backgrounds']: [
                            ...cluster[componentType === 'header' ? 'headers' : componentType === 'footer' ? 'footers' : 'backgrounds'],
                            newComponent
                        ]
                    }
                    : cluster
            ));
        }
    };

    const handleCreateCluster = () => {
        if (!newClusterName.trim()) return;

        const newCluster: FrameCluster = {
            id: `cluster-${Date.now()}`,
            name: newClusterName,
            headers: [],
            footers: [],
            backgrounds: [],
            frames: [],
        };

        setFrameClusters(prev => [...prev, newCluster]);
        setSelectedCluster(newCluster.id);
        setNewClusterName("");
    };

    const handleRemoveComponent = (componentId: string, type: 'header' | 'footer' | 'background') => {
        setFrameComponents(prev => prev.filter(comp => comp.id !== componentId));
        setFrameClusters(prev => prev.map(cluster => {
            if (cluster.id !== selectedCluster) return cluster;
            const key = type === 'header' ? 'headers' : type === 'footer' ? 'footers' : 'backgrounds';
            return {
                ...cluster,
                [key]: cluster[key].filter((comp: FrameComponent) => comp.id !== componentId),
            };
        }));

        if (selectedHeader === componentId) setSelectedHeader("");
        if (selectedFooter === componentId) setSelectedFooter("");
        setSelectedBackgrounds(prev => prev.map(id => (id === componentId ? "" : id)));
    };

    const handleCreatePreset = () => {
        if (!selectedCluster || !presetName.trim()) return;

        const photoCount = layoutPhotoCount[layoutChoice];
        const backgrounds =
            selectedBackgrounds.length === photoCount
                ? selectedBackgrounds
                : Array.from({ length: photoCount }, () => selectedBackgrounds[0] || "");

        const newPreset: EventFramePreset = {
            id: `preset-${Date.now()}`,
            name: presetName,
            clusterId: selectedCluster,
            layoutType: layoutChoice,
            headerId: selectedHeader,
            footerId: selectedFooter,
            backgroundIds: backgrounds,
        };

        setEventFrames(prev => {
            const updated = [...prev, newPreset];
            // gọi save ngay sau khi cập nhật
            (window as any).electronAPI?.saveAppState({
                frameComponents,
                frameClusters,
                eventFrames: updated
            });
            return updated;
        });

        setSelectedEventPreset(newPreset);
        setMode("event");
        navigate("/event-frame");
    };

    useEffect(() => {
        if ((window as any).electronAPI) {
            const state = {
                frameComponents,
                frameClusters,
                eventFrames,
            };
            console.log("🔄 Persisting state to disk:", state);
            (window as any).electronAPI.saveAppState(state);
        } else {
            console.warn("⚠️ electronAPI không khả dụng, state chưa được lưu.");
        }
    }, [frameComponents, frameClusters, eventFrames]);

    const currentCluster = frameClusters.find(c => c.id === selectedCluster);
    const clusterPresets = eventFrames.filter(preset => preset.clusterId === selectedCluster);

    const handlePresetSelect = (preset: EventFramePreset) => {
        setSelectedEventPreset(preset);
        setMode("event");
        navigate("/event-frame");
    };

    const handleDeletePreset = (presetId: string) => {
        setConfirmDialog({
            show: true,
            title: "Xóa Preset",
            message: "Bạn có chắc chắn muốn xóa preset này?",
            onConfirm: () => {
                setEventFrames(prev => prev.filter(p => p.id !== presetId));
                setConfirmDialog({ show: false, title: "", message: "", onConfirm: () => {} });
            }
        });
    };

    const handleDeleteCluster = (clusterId: string) => {
        setConfirmDialog({
            show: true,
            title: "Xóa Cụm Khung",
            message: "Bạn có chắc chắn muốn xóa cụm khung này và tất cả preset liên quan?",
            onConfirm: () => {
                const presetsToDelete = eventFrames.filter(p => p.clusterId === clusterId).map(p => p.id);
                const componentsToDelete = frameClusters.find(c => c.id === clusterId);
                
                // Delete presets
                setEventFrames(prev => prev.filter(p => !presetsToDelete.includes(p.id)));
                
                // Delete cluster
                setFrameClusters(prev => prev.filter(c => c.id !== clusterId));
                
                // Delete components
                if (componentsToDelete) {
                    const componentIds = [
                        ...componentsToDelete.headers,
                        ...componentsToDelete.footers,
                        ...componentsToDelete.backgrounds,
                        ...componentsToDelete.frames
                    ].map(comp => comp.id);
                    setFrameComponents(prev => prev.filter(comp => !componentIds.includes(comp.id)));
                }
                
                if (selectedCluster === clusterId) {
                    setSelectedCluster("");
                }
                
                setConfirmDialog({ show: false, title: "", message: "", onConfirm: () => {} });
            }
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="frame-library-page">
            <div className="frame-library-card">
                <div className="frame-library-content">
                    <button type="button" className="back-btn" onClick={handleBack} title="Quay lại">← Quay lại</button>
                    <div className="frame-library-header">
                        <h1>THƯ VIỆN KHUNG</h1>
                        <p>Tải lên và quản lý các thành phần khung sự kiện</p>
                    </div>

                    <div className="section-row">
                        <h2>Tạo cụm khung mới</h2>
                        <div className="cluster-creation">
                            <input
                                type="text"
                                placeholder="Tên cụm khung (vd: Đám cưới)"
                                value={newClusterName}
                                onChange={(e) => setNewClusterName(e.target.value)}
                            />
                            <button onClick={handleCreateCluster}>Tạo cụm</button>
                        </div>
                    </div>

                    <div className="section-row">
                        <h2>Chọn cụm khung</h2>
                        <div className="cluster-selection">
                            {frameClusters.map(cluster => (
                                <div key={cluster.id} className="cluster-btn-wrapper">
                                    <button
                                        className={`cluster-btn ${selectedCluster === cluster.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedCluster(cluster.id)}
                                    >
                                        {cluster.name}
                                    </button>
                                    <button
                                        type="button"
                                        className="cluster-delete-btn"
                                        onClick={() => handleDeleteCluster(cluster.id)}
                                        title="Xóa cụm"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedCluster && (
                        <>
                            <div className="section-row">
                                <h2>Tải lên thành phần</h2>
                                <div className="upload-type-row">
                                    <button
                                        type="button"
                                        className={`upload-type-btn ${uploadType === 'header' ? 'selected' : ''}`}
                                        onClick={() => setUploadType('header')}
                                    >Header</button>
                                    <button
                                        type="button"
                                        className={`upload-type-btn ${uploadType === 'footer' ? 'selected' : ''}`}
                                        onClick={() => setUploadType('footer')}
                                    >Footer</button>
                                    <button
                                        type="button"
                                        className={`upload-type-btn ${uploadType === 'background' ? 'selected' : ''}`}
                                        onClick={() => setUploadType('background')}
                                    >Background</button>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <button onClick={() => fileInputRef.current?.click()}>
                                    Chọn file cho {uploadType}
                                </button>
                            </div>

                            {clusterPresets.length > 0 && (
                                <div className="section-row">
                                    <h2>Preset đã lưu cho cụm này</h2>
                                    <div className="preset-list">
                                        {clusterPresets.map((preset) => (
                                            <div key={preset.id} className="preset-card">
                                                <div className="preset-card-title">{preset.name}</div>
                                                <div className="preset-card-meta">Layout: {preset.layoutType === "6square" ? "3x2" : preset.layoutType === "2strip" ? "2 strip" : preset.layoutType === "3strip" ? "3 strip" : "Đơn"}</div>
                                                <div className="preset-card-actions">
                                                    <button type="button" className="preset-select-btn" onClick={() => handlePresetSelect(preset)}>
                                                        Dùng preset
                                                    </button>
                                                    <button type="button" className="preset-delete-btn" onClick={() => handleDeletePreset(preset.id)} title="Xóa preset">
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="components-grid">
                                <div className="component-section">
                                    <h3>Headers ({currentCluster?.headers.length})</h3>
                                    <div className="component-list">
                                        {currentCluster?.headers.map(comp => (
                                            <div key={comp.id} className="component-preview-card">
                                                <img src={comp.src} alt={comp.name} />
                                                <button type="button" className="component-remove-btn" onClick={() => handleRemoveComponent(comp.id, 'header')}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="component-section">
                                    <h3>Footers ({currentCluster?.footers.length})</h3>
                                    <div className="component-list">
                                        {currentCluster?.footers.map(comp => (
                                            <div key={comp.id} className="component-preview-card">
                                                <img src={comp.src} alt={comp.name} />
                                                <button type="button" className="component-remove-btn" onClick={() => handleRemoveComponent(comp.id, 'footer')}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="component-section">
                                    <h3>Backgrounds ({currentCluster?.backgrounds.length})</h3>
                                    <div className="component-list">
                                        {currentCluster?.backgrounds.map(comp => (
                                            <div key={comp.id} className="component-preview-card">
                                                <img src={comp.src} alt={comp.name} />
                                                <button type="button" className="component-remove-btn" onClick={() => handleRemoveComponent(comp.id, 'background')}>
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="section-row">
                                <h2>Chọn loại strip</h2>
                                <div className="layout-options">
                                    {Object.keys(layoutPhotoCount).map(layout => (
                                        <button
                                            key={layout}
                                            className={`layout-btn ${layoutChoice === layout ? 'selected' : ''}`}
                                            onClick={() => setLayoutChoice(layout)}
                                        >
                                            {layout === '6square' ? '3x2' : layout}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="section-row">
                                <h2>Ghép khung</h2>
                                <div className="preset-creation">
                                    <input
                                        type="text"
                                        placeholder="Tên khung"
                                        value={presetName}
                                        onChange={(e) => setPresetName(e.target.value)}
                                    />
                                    <select value={selectedHeader} onChange={(e) => setSelectedHeader(e.target.value)}>
                                        <option value="">Chọn Header</option>
                                        {currentCluster?.headers.map(h => (
                                            <option key={h.id} value={h.id}>{h.name}</option>
                                        ))}
                                    </select>
                                    <select value={selectedFooter} onChange={(e) => setSelectedFooter(e.target.value)}>
                                        <option value="">Chọn Footer</option>
                                        {currentCluster?.footers.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                    <div className="background-selection">
                                        <label>Chọn Background cho từng slot:</label>
                                        {Array.from({ length: layoutPhotoCount[layoutChoice] }, (_, i) => (
                                            <select
                                                key={i}
                                                value={selectedBackgrounds[i] || ""}
                                                onChange={(e) => {
                                                    const newBackgrounds = [...selectedBackgrounds];
                                                    newBackgrounds[i] = e.target.value;
                                                    setSelectedBackgrounds(newBackgrounds);
                                                }}
                                            >
                                                <option value="">Chọn Background cho slot {i + 1}</option>
                                                {currentCluster?.backgrounds.map(b => (
                                                    <option key={b.id} value={b.id}>{b.name}</option>
                                                ))}
                                            </select>
                                        ))}
                                    </div>
                                    <button onClick={handleCreatePreset} disabled={!presetName.trim()}>
                                        Tạo khung và tiếp tục
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {confirmDialog.show && (
                <div className="confirmation-modal">
                    <div className="confirmation-dialog">
                        <h2>{confirmDialog.title}</h2>
                        <p>{confirmDialog.message}</p>
                        <div className="confirmation-actions">
                            <button type="button" className="confirm-btn" onClick={confirmDialog.onConfirm}>
                                Xác nhận
                            </button>
                            <button type="button" className="cancel-btn" onClick={() => setConfirmDialog({ show: false, title: "", message: "", onConfirm: () => {} })}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FrameLibrary;
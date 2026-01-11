/**
 * BookingBlocksBuilder Component
 * 
 * Allows admins to design the booking details page by adding/removing/reordering blocks.
 * Each block represents a field or input in the booking flow.
 */
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  X,
  AlertCircle
} from "lucide-react";
import { BookingBlockType, BlockOptions } from "../booking/serviceConfig.js";

export default function BookingBlocksBuilder({ 
  blocks = [], 
  onChange,
  subServices = [] // Available sub-services for SUB_SERVICE block
}) {
  const [localBlocks, setLocalBlocks] = useState(blocks || []);
  const [expandedBlock, setExpandedBlock] = useState(null);

  useEffect(() => {
    setLocalBlocks(blocks || []);
  }, [blocks]);

  const updateBlocks = (newBlocks) => {
    setLocalBlocks(newBlocks);
    if (typeof onChange === 'function') {
      onChange(newBlocks);
    }
  };

  const addBlock = (type) => {
    const newBlock = {
      type,
      required: false,
      ...getDefaultBlockConfig(type),
    };
    updateBlocks([...localBlocks, newBlock]);
  };

  const removeBlock = (index) => {
    updateBlocks(localBlocks.filter((_, i) => i !== index));
  };

  const updateBlock = (index, updates) => {
    const updated = [...localBlocks];
    updated[index] = { ...updated[index], ...updates };
    updateBlocks(updated);
  };

  const moveBlock = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === localBlocks.length - 1)
    ) {
      return;
    }
    const updated = [...localBlocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updateBlocks(updated);
  };

  const getDefaultBlockConfig = (type) => {
    switch (type) {
      case BookingBlockType.SUB_SERVICE:
        return {
          options: subServices.length > 0 ? subServices : [],
          label: "Service type",
        };
      case BookingBlockType.FREQUENCY:
        return { label: "How often?" };
      case BookingBlockType.HOME_SIZE:
        return { label: "Home size" };
      case BookingBlockType.LAUNDRY_UNITS:
        return { label: "Laundry volume" };
      case BookingBlockType.HANDYMAN_JOB_TYPE:
        return { label: "Job type" };
      case BookingBlockType.SNOW_OPTIONS:
        return { label: "Snow removal options" };
      case BookingBlockType.VEHICLE_TYPE:
        return { label: "Vehicle type" };
      case BookingBlockType.JOB_DESCRIPTION:
        return {
          label: "Job description",
          placeholder: "Describe the work needed...",
        };
      case BookingBlockType.PHOTO_UPLOAD:
        return {
          label: "Upload photos",
          placeholder: "Upload photos to help us understand your needs",
        };
      case BookingBlockType.SIMPLE_NOTE:
        return {
          label: "Additional notes (optional)",
          placeholder: "Access notes, issues, pets, special requests, etc.",
        };
      default:
        return {};
    }
  };

  const getBlockTypeLabel = (type) => {
    const labels = {
      [BookingBlockType.SUB_SERVICE]: "Sub-service Selection",
      [BookingBlockType.FREQUENCY]: "Frequency (Recurring)",
      [BookingBlockType.HOME_SIZE]: "Home Size",
      [BookingBlockType.LAUNDRY_UNITS]: "Laundry Units",
      [BookingBlockType.HANDYMAN_JOB_TYPE]: "Handyman Job Type",
      [BookingBlockType.SNOW_OPTIONS]: "Snow Options",
      [BookingBlockType.VEHICLE_TYPE]: "Vehicle Type",
      [BookingBlockType.JOB_DESCRIPTION]: "Job Description (Text)",
      [BookingBlockType.PHOTO_UPLOAD]: "Photo Upload",
      [BookingBlockType.SIMPLE_NOTE]: "Additional Notes (Text)",
    };
    return labels[type] || type;
  };

  const getAvailableBlockTypes = () => {
    // Don't allow duplicate SUB_SERVICE blocks
    const hasSubService = localBlocks.some(b => b.type === BookingBlockType.SUB_SERVICE);
    
    return Object.values(BookingBlockType).filter(type => {
      if (type === BookingBlockType.SUB_SERVICE && hasSubService) {
        return false;
      }
      return true;
    });
  };

  const renderBlockEditor = (block, index) => {
    const isExpanded = expandedBlock === index;

    return (
      <div
        key={index}
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          marginBottom: "12px",
          background: "#fff",
        }}
      >
        {/* Block Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            background: "#f9fafb",
            borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
            cursor: "pointer",
          }}
          onClick={() => setExpandedBlock(isExpanded ? null : index)}
        >
          <GripVertical size={16} style={{ marginRight: "8px", color: "#9ca3af" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>
              {index + 1}. {getBlockTypeLabel(block.type)}
            </div>
            {block.label && (
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                {block.label}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveBlock(index, "up");
              }}
              disabled={index === 0}
              style={{
                padding: "4px",
                border: "none",
                background: "none",
                cursor: index === 0 ? "not-allowed" : "pointer",
                opacity: index === 0 ? 0.3 : 1,
              }}
            >
              <ChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                moveBlock(index, "down");
              }}
              disabled={index === localBlocks.length - 1}
              style={{
                padding: "4px",
                border: "none",
                background: "none",
                cursor: index === localBlocks.length - 1 ? "not-allowed" : "pointer",
                opacity: index === localBlocks.length - 1 ? 0.3 : 1,
              }}
            >
              <ChevronDown size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Remove this block?")) {
                  removeBlock(index);
                }
              }}
              style={{
                padding: "4px",
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#dc2626",
                marginLeft: "8px",
              }}
            >
              <Trash2 size={16} />
            </button>
            <ChevronDown
              size={16}
              style={{
                marginLeft: "8px",
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </div>
        </div>

        {/* Block Editor */}
        {isExpanded && (
          <div style={{ padding: "16px" }}>
            {/* Required Toggle */}
            <label style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <input
                type="checkbox"
                checked={block.required || false}
                onChange={(e) => updateBlock(index, { required: e.target.checked })}
                style={{ marginRight: "8px" }}
              />
              <span style={{ fontSize: "14px", fontWeight: 500 }}>
                Required field
              </span>
            </label>

            {/* Custom Label */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
                Custom Label
              </label>
              <input
                type="text"
                value={block.label || ""}
                onChange={(e) => updateBlock(index, { label: e.target.value })}
                placeholder={getDefaultBlockConfig(block.type).label}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Options Editor (for SUB_SERVICE and other option-based blocks) */}
            {(block.type === BookingBlockType.SUB_SERVICE) && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
                  Options (from sub-services)
                </label>
                <div style={{ 
                  padding: "12px",
                  background: "#f9fafb",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#6b7280",
                }}>
                  {subServices.length > 0 ? (
                    <div>
                      <p style={{ marginBottom: "8px" }}>Using sub-services:</p>
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {subServices.map((opt, i) => (
                          <li key={i}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>Add sub-services above to populate options</p>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder Editor (for text fields) */}
            {[
              BookingBlockType.JOB_DESCRIPTION,
              BookingBlockType.SIMPLE_NOTE,
              BookingBlockType.PHOTO_UPLOAD,
            ].includes(block.type) && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, marginBottom: "6px" }}>
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={block.placeholder || ""}
                  onChange={(e) => updateBlock(index, { placeholder: e.target.value })}
                  placeholder={getDefaultBlockConfig(block.type).placeholder}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
            Booking Details Page Blocks
          </label>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            Design the booking form by adding blocks. Each block is a field customers will see.
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              // Simple dropdown would go here, but for now we'll use a basic add button
              const type = getAvailableBlockTypes()[0];
              if (type) addBlock(type);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "#0b5c28",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <Plus size={16} />
            Add Block
          </button>
        </div>
      </div>

      {/* Block Type Selector */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginBottom: "16px",
        }}
      >
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) {
              addBlock(e.target.value);
              e.target.value = "";
            }
          }}
          style={{
            padding: "8px 32px 8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "14px",
            background: "white",
            cursor: "pointer",
          }}
        >
          <option value="">Select block type to add...</option>
          {getAvailableBlockTypes().map((type) => (
            <option key={type} value={type}>
              {getBlockTypeLabel(type)}
            </option>
          ))}
        </select>
      </div>

      {/* Blocks List */}
      {localBlocks.length === 0 ? (
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            border: "2px dashed #e5e7eb",
            borderRadius: "8px",
            background: "#f9fafb",
          }}
        >
          <AlertCircle size={32} style={{ margin: "0 auto 12px", color: "#9ca3af" }} />
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
            No blocks added yet. Add blocks to design your booking form.
          </p>
        </div>
      ) : (
        <div>{localBlocks.map((block, index) => renderBlockEditor(block, index))}</div>
      )}

      {/* Info */}
      {localBlocks.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            background: "#eff6ff",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#1e40af",
          }}
        >
          <strong>Tip:</strong> The blocks will appear in the order shown above. 
          Most services should start with a Sub-service Selection block, and end with Additional Notes.
        </div>
      )}
    </div>
  );
}

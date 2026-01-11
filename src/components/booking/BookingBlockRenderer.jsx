/**
 * BookingBlockRenderer
 * 
 * Renders individual booking blocks based on their type.
 * This is the ONLY rendering logic for Step 2 - no service-specific conditionals.
 */
import React from "react";
import { BookingBlockType, BlockOptions } from "./serviceConfig.js";

export default function BookingBlockRenderer({
  block,
  value,
  onChange,
  serviceSlug,
}) {
  switch (block.type) {
    case BookingBlockType.SUB_SERVICE:
      return renderSubServiceBlock(block, value, onChange);

    case BookingBlockType.FREQUENCY:
      return renderFrequencyBlock(block, value, onChange);

    case BookingBlockType.HOME_SIZE:
      return renderHomeSizeBlock(block, value, onChange);

    case BookingBlockType.LAUNDRY_UNITS:
      return renderLaundryUnitsBlock(block, value, onChange);

    case BookingBlockType.HANDYMAN_JOB_TYPE:
      return renderHandymanJobTypeBlock(block, value, onChange);

    case BookingBlockType.SNOW_OPTIONS:
      return renderSnowOptionsBlock(block, value, onChange);

    case BookingBlockType.VEHICLE_TYPE:
      return renderVehicleTypeBlock(block, value, onChange);

    case BookingBlockType.JOB_DESCRIPTION:
      return renderJobDescriptionBlock(block, value, onChange);

    case BookingBlockType.PHOTO_UPLOAD:
      return renderPhotoUploadBlock(block, value, onChange);

    case BookingBlockType.SIMPLE_NOTE:
      return renderSimpleNoteBlock(block, value, onChange);

    default:
      console.warn(`Unknown booking block type: ${block.type}`);
      return null;
  }
}

function renderSubServiceBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">Service type {block.required && "*"}</div>
      <div className="details-options">
        {(block.options || []).map((option) => (
          <div
            key={option}
            className={`details-option ${value === option ? "active" : ""}`}
            onClick={() => onChange(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFrequencyBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">How often?</div>
      <div className="details-pills">
        {BlockOptions[BookingBlockType.FREQUENCY].map((freq) => (
          <div
            key={freq}
            className={`details-pill ${value === freq ? "active" : ""}`}
            onClick={() => onChange(freq)}
          >
            {freq}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderHomeSizeBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">Home size</div>
      <div className="details-options">
        {BlockOptions[BookingBlockType.HOME_SIZE].map((size) => (
          <div
            key={size}
            className={`details-option ${value === size ? "active" : ""}`}
            onClick={() => onChange(size)}
          >
            {size}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderLaundryUnitsBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">Laundry volume</div>
      <div className="details-pills">
        {BlockOptions[BookingBlockType.LAUNDRY_UNITS].map((unit) => (
          <div
            key={unit}
            className={`details-pill ${value === unit ? "active" : ""}`}
            onClick={() => onChange(unit)}
          >
            {unit}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderHandymanJobTypeBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">Job type</div>
      <div className="details-pills">
        {BlockOptions[BookingBlockType.HANDYMAN_JOB_TYPE].map((jobType) => (
          <div
            key={jobType}
            className={`details-pill ${value === jobType ? "active" : ""}`}
            onClick={() => onChange(jobType)}
          >
            {jobType}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSnowOptionsBlock(block, value, onChange) {
  const snowValue = value || { propertyType: "", includeWalkways: false };
  const options = BlockOptions[BookingBlockType.SNOW_OPTIONS];

  return (
    <>
      <div className="details-section">
        <div className="details-label">Property type</div>
        <div className="details-pills">
          {options.propertyType.map((propType) => (
            <div
              key={propType}
              className={`details-pill ${
                snowValue.propertyType === propType ? "active" : ""
              }`}
              onClick={() =>
                onChange({ ...snowValue, propertyType: propType })
              }
            >
              {propType}
            </div>
          ))}
        </div>
      </div>

      <div className="details-section">
        <div className="details-label">Include walkways?</div>
        <div className="details-pills">
          {["Yes", "No"].map((opt) => (
            <div
              key={opt}
              className={`details-pill ${
                snowValue.includeWalkways === (opt === "Yes") ? "active" : ""
              }`}
              onClick={() =>
                onChange({
                  ...snowValue,
                  includeWalkways: opt === "Yes",
                })
              }
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function renderVehicleTypeBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">Vehicle type</div>
      <div className="details-pills">
        {BlockOptions[BookingBlockType.VEHICLE_TYPE].map((vehicle) => (
          <div
            key={vehicle}
            className={`details-pill ${value === vehicle ? "active" : ""}`}
            onClick={() => onChange(vehicle)}
          >
            {vehicle}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderJobDescriptionBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">
        Job description {block.required && "*"}
      </div>
      <textarea
        className="details-textarea"
        placeholder={
          block.placeholder ||
          "Please describe the work you need done..."
        }
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
}

function renderPhotoUploadBlock(block, value, onChange) {
  const photos = value || [];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Convert files to base64 data URLs for preview and storage
    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: reader.result,
            // Store the original file for actual upload later
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((newPhotos) => {
      onChange([...photos, ...newPhotos]);
    });
  };

  const removePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? updated : null);
  };

  return (
    <div className="details-section">
      <div className="details-label">
        {block.label || "Upload photos"}
        {block.required ? " *" : " (optional)"}
      </div>
      <div className="photo-upload-container">
        <label className="photo-upload-button">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <span>+ Add Photos</span>
        </label>
        
        {photos.length > 0 && (
          <div className="photo-preview-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-preview-item">
                <img
                  src={photo.dataUrl || photo}
                  alt={`Upload ${index + 1}`}
                  className="photo-preview-image"
                />
                <button
                  type="button"
                  className="photo-remove-button"
                  onClick={() => removePhoto(index)}
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {photos.length === 0 && (
          <p className="photo-upload-hint">
            {block.placeholder || "Upload photos to help us understand your needs"}
          </p>
        )}
      </div>
    </div>
  );
}

function renderSimpleNoteBlock(block, value, onChange) {
  return (
    <div className="details-section">
      <div className="details-label">
        {block.label || "Additional notes"}
        {block.required ? " *" : " (optional)"}
      </div>
      <textarea
        className="details-textarea"
        placeholder={block.placeholder || "Access notes, issues, pets, special requests, etc."}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
}

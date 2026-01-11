/**
 * BookingDetailsCard (Step 2) - FINAL ARCHITECTURE
 * 
 * This component is now fully schema-driven using bookingBlocks.
 * It receives a normalized ServiceConfig and renders blocks in order.
 * 
 * No legacy compatibility logic exists here - all normalization happens upstream.
 */
import React, { useEffect, useMemo } from "react";
import { normalizeServiceToConfig, BookingBlockType } from "./serviceConfig.js";
import BookingBlockRenderer from "./BookingBlockRenderer.jsx";

export default function BookingDetailsCard({
  service, // Raw service data from backend
  details,
  setDetails,
  onBack,
  onNext,
}) {
  // Normalize service data ONCE into clean config
  const serviceConfig = useMemo(() => {
    try {
      return normalizeServiceToConfig(service);
    } catch (error) {
      console.error('[BookingDetailsCard] Error normalizing service:', error);
      return null;
    }
  }, [service]);

  // Initialize details.blocks if it doesn't exist
  useEffect(() => {
    if (!details.blocks) {
      setDetails((prev) => ({
        ...prev,
        blocks: {},
      }));
    }
  }, [details.blocks, setDetails]);

  // Auto-select first sub-service if available
  useEffect(() => {
    if (!serviceConfig) return;

    const subServiceBlock = serviceConfig.bookingBlocks.find(
      (b) => b.type === BookingBlockType.SUB_SERVICE
    );

    if (
      subServiceBlock &&
      subServiceBlock.options &&
      subServiceBlock.options.length > 0 &&
      !details.blocks?.[BookingBlockType.SUB_SERVICE]
    ) {
      setDetails((prev) => ({
        ...prev,
        blocks: {
          ...(prev.blocks || {}),
          [BookingBlockType.SUB_SERVICE]: subServiceBlock.options[0],
        },
        // Also maintain legacy format for backward compatibility with other steps
        subService: subServiceBlock.options[0],
      }));
    }
  }, [serviceConfig, details.blocks, setDetails]);

  // Handle block value changes
  const handleBlockChange = (blockType, value) => {
    setDetails((prev) => {
      const newBlocks = {
        ...(prev.blocks || {}),
        [blockType]: value,
      };

      // Also update legacy format for backward compatibility
      const legacyUpdates = {};

      if (blockType === BookingBlockType.SUB_SERVICE) {
        legacyUpdates.subService = value;
      } else if (blockType === BookingBlockType.FREQUENCY) {
        legacyUpdates.frequency = value;
      } else if (blockType === BookingBlockType.SIMPLE_NOTE) {
        legacyUpdates.extraNotes = value;
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          extraNotes: value,
        };
      } else if (blockType === BookingBlockType.HOME_SIZE) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          homeSize: value,
        };
      } else if (blockType === BookingBlockType.LAUNDRY_UNITS) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          laundryUnits: value,
        };
      } else if (blockType === BookingBlockType.HANDYMAN_JOB_TYPE) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          handymanJobType: value,
        };
      } else if (blockType === BookingBlockType.SNOW_OPTIONS) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          snowPropertyType: value.propertyType,
          snowIncludeWalkways: value.includeWalkways,
        };
      } else if (blockType === BookingBlockType.VEHICLE_TYPE) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          autoVehicleType: value,
        };
      } else if (blockType === BookingBlockType.JOB_DESCRIPTION) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          jobDescription: value,
        };
      } else if (blockType === BookingBlockType.PHOTO_UPLOAD) {
        legacyUpdates.extras = {
          ...(prev.extras || {}),
          photos: value,
        };
      }

      return {
        ...prev,
        blocks: newBlocks,
        ...legacyUpdates,
      };
    });
  };

  // Validate required blocks
  const canProceed = useMemo(() => {
    if (!serviceConfig) return false;

    return serviceConfig.bookingBlocks.every((block) => {
      if (!block.required) return true;

      const value = details.blocks?.[block.type];
      
      if (block.type === BookingBlockType.SNOW_OPTIONS) {
        return value?.propertyType;
      }

      if (block.type === BookingBlockType.PHOTO_UPLOAD) {
        return Array.isArray(value) && value.length > 0;
      }

      return Boolean(value);
    });
  }, [serviceConfig, details.blocks]);

  // Error state
  if (!serviceConfig) {
    return (
      <div className="booking-card">
        <h2 className="details-title">Service not found</h2>
        <p>Please go back and select a service.</p>
        <div className="service-footer">
          <button className="btn-secondary" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    );
  }

  // Render service config
  return (
    <div className="booking-card">
      <h2 className="details-title">{serviceConfig.title} details</h2>

      {/* Render all booking blocks in order */}
      {serviceConfig.bookingBlocks.map((block, index) => {
        const blockValue = details.blocks?.[block.type];
        return (
          <BookingBlockRenderer
            key={`${block.type}-${index}`}
            block={block}
            value={blockValue}
            onChange={(value) => handleBlockChange(block.type, value)}
            serviceSlug={serviceConfig.slug}
          />
        );
      })}

      {/* Actions */}
      <div className="service-footer">
        <button className="btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../lib/api";

export const useHubTenants = (hubId) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/hub/tenants?hubId=${hubId}`);

      if (response.data.success) {
        setTenants(response.data.tenants);
      }
    } catch (err) {
      console.error("Fetch tenants error:", err);
      setError(err.response?.data?.message || "Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (tenantData) => {
    try {
      const response = await api.post("/hub/tenants", {
        ...tenantData,
        hubId,
      });

      if (response.data.success) {
        await fetchTenants();
        return response.data.tenant;
      }
    } catch (err) {
      console.error("Create tenant error:", err);
      throw err;
    }
  };

  const updateTenant = async (tenantId, updates) => {
    try {
      const response = await api.put(`/hub/tenants/${tenantId}`, updates);

      if (response.data.success) {
        await fetchTenants();
        return response.data.tenant;
      }
    } catch (err) {
      console.error("Update tenant error:", err);
      throw err;
    }
  };

  const deleteTenant = async (tenantId) => {
    try {
      const response = await api.delete(`/hub/tenants/${tenantId}`);

      if (response.data.success) {
        await fetchTenants();
        return true;
      }
    } catch (err) {
      console.error("Delete tenant error:", err);
      throw err;
    }
  };

  const requestCapacity = async (tenantId, requestedKW, deviceId, purpose) => {
    try {
      const response = await api.post(
        `/hub/tenants/${tenantId}/request-capacity`,
        {
          requestedKW,
          deviceId,
          purpose,
        }
      );

      if (response.data.success) {
        await fetchTenants();
        return response.data;
      }
    } catch (err) {
      console.error("Request capacity error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (hubId) {
      fetchTenants();
    }
  }, [hubId]);

  return {
    tenants,
    loading,
    error,
    refresh: fetchTenants,
    createTenant,
    updateTenant,
    deleteTenant,
    requestCapacity,
  };
};

export default useHubTenants;

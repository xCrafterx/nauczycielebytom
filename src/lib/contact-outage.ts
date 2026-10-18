import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export async function readContactOutage() {
  const { data, error } = await supabase.from("contact_outage").select("visible").eq("id", true).single();
  if (error) throw error;
  return data.visible;
}

export async function saveContactOutage(visible: boolean) {
  const { data, error } = await supabase.from("contact_outage").update({ visible }).eq("id", true).select("visible").single();
  if (error) throw error;
  return data.visible;
}

export function useContactOutage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["contact-outage"], queryFn: readContactOutage, refetchInterval: 15_000 });
  const save = async (visible: boolean) => {
    const saved = await saveContactOutage(visible);
    queryClient.setQueryData(["contact-outage"], saved);
  };
  return { ...query, save };
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sleep } from "@/lib/utils";

export function CommunityCreateStep2() {
  const { communityInfo, prevStep, reset } = useCommunityCreateStore();
  const [isCreating, setIsCreating] = useState(false);

  // Générer le fallback pour l'avatar basé sur le nom
  const getAvatarFallback = () => {
    if (communityInfo.name) {
      return communityInfo.name.slice(0, 2).toUpperCase();
    }
    return "CO"; // Community Organization fallback
  };

  // Gérer la création de la communauté
  const handleCreate = async () => {
    setIsCreating(true);

    try {
      // Simulation de la création
      await sleep(1500);

      // Réinitialiser le formulaire
      reset();

      // Naviguer vers une autre page - à implémenter plus tard
      console.log("Community created successfully");
    } catch (error) {
      console.error("Failed to create community:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Résumé de votre communauté</h2>

      <div className="flex items-start gap-6 p-4 bg-muted/50 rounded-lg">
        <Avatar className="size-20 bg-secondary">
          <AvatarImage src={communityInfo.avatar} />
          <AvatarFallback className="text-lg">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">{communityInfo.name}</h3>
          <p className="text-muted-foreground">{communityInfo.description}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Prochaines étapes:</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
          <li>Inviter des membres</li>
          <li>Définir des règles de communauté</li>
          <li>Créer des discussions</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={prevStep} disabled={isCreating}>
          Retour
        </Button>

        <Button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? "Création en cours..." : "Créer la communauté"}
        </Button>
      </div>
    </div>
  );
}

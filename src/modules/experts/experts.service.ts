import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { getPublishedKnowledgeResources } from "../knowledge-manager/knowledge-manager.service";
import { User } from "../users/entity/user.enity";
import {
  getUserByIdWithRelationsEntry,
  getUsersWithRelationsEntry,
} from "../users/user.service";

const buildExpert = (
  user: User,
  contributionScore: number,
  includeRegion: boolean
) => {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  const roleName = user?.role?.name ?? "consultant";
  const expertise = user.expertise;

  return {
    id: user.id,
    name: name || user.email,
    expertise: expertise ?? roleName,
    profilePicture: null,
    region: includeRegion ? user?.region?.name ?? null : undefined,
    contributionScore,
  };
};

const getContributionScores = async () => {
  const resources = await getPublishedKnowledgeResources();

  const scores = new Map<string, number>();
  resources.forEach((resource) => {
    const userId = resource.uploadedBy?.id;
    if (!userId) {
      return;
    }
    scores.set(userId, (scores.get(userId) || 0) + 1);
  });

  return scores;
};

export const getExperts = async (query?: string) => {
  try {
    const users = await getUsersWithRelationsEntry();

    const scores = await getContributionScores();
    const needle = query?.toLowerCase() ?? "";

    return users
      .filter((user) => {
        if (!needle) return true;
        const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
        const roleName = `${user?.role?.name ?? ""}`.toLowerCase();
        return (
          name.includes(needle) ||
          roleName.includes(needle) ||
          (user.email || "").toLowerCase().includes(needle)
        );
      })
      .map((user) => buildExpert(user, scores.get(user.id) || 0, true));
  } catch (error: any) {
    logger.error(`Get experts error: ${error.message}`);
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const getLeaderboard = async () => {
  try {
    const users = await getUsersWithRelationsEntry();

    const scores = await getContributionScores();
    const ranked = users.map((user) =>
      buildExpert(user, scores.get(user.id) || 0, false)
    );

    return ranked
      .sort((a, b) => (b.contributionScore || 0) - (a.contributionScore || 0))
      .slice(0, 10);
  } catch (error: any) {
    logger.error(`Get leaderboard error: ${error.message}`);
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

export const getExpertProfile = async (id: string) => {
  try {
    const user = await getUserByIdWithRelationsEntry(id);

    if (!user) {
      throw new HttpException(404, { message: "Expert not found", result: false });
    }

    const scores = await getContributionScores();
    return buildExpert(user, scores.get(user.id) || 0, true);
  } catch (error: any) {
    logger.error(`Get expert profile error: ${error.message}`);
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(500, { message: "Server error", result: false });
  }
};

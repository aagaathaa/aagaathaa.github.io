const fs = require("fs");
const path = require("path");
const axios = require("axios");

const USERNAME = "aagaathaa";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "github-portfolio-updater",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function getProfile() {
  const { data } = await axios.get(`https://api.github.com/users/${USERNAME}`, {
    headers,
  });

  return {
    avatar: data.avatar_url,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
  };
}

async function getRepositories() {
  const { data } = await axios.get(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
    { headers },
  );

  return data
    .filter((repo) => !repo.fork)
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
    )
    .slice(0, 6)
    .map((repo, index) => ({
      name: repo.name,
      display_name: repo.name,
      url: repo.html_url,
      featured: index === 0,
      language: repo.language || "Unknown",
      updated_at: repo.updated_at,
    }));
}

function mapEvent(event) {
  let type = "Activity";

  switch (event.type) {
    case "PushEvent":
      type = "Push";
      break;

    case "IssuesEvent":
      type = "Issues";
      break;

    case "PullRequestEvent":
      type = "PullRequest";
      break;

    case "PullRequestReviewEvent":
      type = "PullRequest";
      break;
  }

  return {
    type,
    repo: event.repo.name,
  };
}

async function getEvents() {
  const { data } = await axios.get(
    `https://api.github.com/users/${USERNAME}/events/public?per_page=6`,
    { headers },
  );

  return data.map(mapEvent);
}

async function main() {
  try {
    console.log("Fetching GitHub profile...");
    const profile = await getProfile();

    console.log("Fetching repositories...");
    const repos = await getRepositories();

    console.log("Fetching events...");
    const events = await getEvents();

    const output = {
      generated_at: new Date().toISOString(),
      profile,
      repos,
      events,
    };

    const outputDir = path.join(process.cwd(), "data");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, "github-data.json");

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), "utf8");

    console.log("✅ Successfully updated data/github-data.json");
  } catch (error) {
    console.error("❌ Failed to update GitHub data");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    process.exit(1);
  }
}

main();

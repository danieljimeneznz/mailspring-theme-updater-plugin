import { React } from "mailspring-exports";
import Octokit from "@octokit/rest";
import * as fs from "fs";

export default class ThemeUpdaterPlugin extends React.Component<{}, {}> {
  static displayName = "ThemeUpdaterPlugin";

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    console.log("Theme updater plugin mounted.");

    // Retrieve the current active theme directory and name.
    // @ts-ignore
    const directory = AppEnv.themes.activeThemePackage.directory;
    // @ts-ignore
    const theme = AppEnv.themes.activeThemePackage.name;

    // Store of commit hashes that the user has locally.
    let commits = [];

    // Check the current theme isn't in the app.asar.
    if (!directory.includes("app.asar")) {
      console.log("Current theme is not part of mailspring so updating.");

      // Retrieve remote information from theme folder.
      let remote: { user: string; repo: string };

      // Repository has a .git directory.
      if (fs.readdirSync(directory).includes(".git")) {
        console.log("Directory is a git repo.");
        const config = fs.readFileSync(`${directory}/.git/config`, "utf-8");
        try {
          // Grab the url specified in the git config file.
          const configRemoteRegex = /\[remote\s*"origin"\]\n\s*url\s*=\s*(.*).git/g;
          let url = configRemoteRegex.exec(config)[1];

          // Check that we are dealing with a GitHub remote repository.
          if (!url.includes("github")) {
            throw new Error("Repository must be a GitHub repository");
          }

          if (url.includes("@")) {
            // Remote specified was a ssh based git repo.
            url = url.split(":")[1];
            remote = {
              user: url.split("/")[0],
              repo: url.split("/")[1]
            };
          } else {
            // Remote specified was a http based git repo.
            url = url.replace(/http.*github.com\//g, "");
            remote = {
              user: url.split("/")[0],
              repo: url.split("/")[1]
            };
          }

          // Get the commits that the user currently has.
          commits = fs
            .readFileSync(`${directory}/.git/logs/HEAD`, "utf-8")
            .split("\n")
            .filter(s => {
              return s !== "";
            })
            .map(s => {
              return s.split(" ")[1];
            })
            .reverse();

          console.log({ commits });
        } catch (e) {
          throw new Error(`Error finding remote information from git config.`);
        }
      } else {
        console.log(
          "Directory is not a git repo, checking package.json for remote."
        );
        if (fs.readdirSync(directory).includes("package.json")) {
          const pkg: any = JSON.parse(
            fs.readFileSync(`${directory}/package.json`, "utf-8")
          );

          if (
            pkg.hasOwnProperty("repository") &&
            pkg.repository.hasOwnProperty("url")
          ) {
            let url = pkg.repository.url;

            // Check that we are dealing with a GitHub remote repository.
            if (!url.includes("github")) {
              throw new Error("Repository must be a GitHub repository");
            }

            if (url.includes("@")) {
              // Remote specified was a ssh based git repo.
              url = url.split(":")[1];
              remote = {
                user: url.split("/")[0],
                repo: url.split("/")[1]
              };
            } else {
              // Remote specified was a http based git repo.
              url = url.replace(/http.*github.com\//g, "");
              remote = {
                user: url.split("/")[0],
                repo: url.split("/")[1]
              };
            }

            // Folder is not a .git repo, create a folder to store update logs in.
          } else {
            throw new Error(
              "Unable to find remote for theme so cannot update."
            );
          }
        } else {
          throw new Error("Unable to find remote for theme so cannot update.");
        }
      }

      // Remote is now known, call github api to retrieve a list of commits.
      const octokit = new Octokit();
      let { data: remoteCommitsObj } = await octokit.repos.listCommits({
        owner: remote.user,
        repo: remote.repo
      });

      const remoteCommits = remoteCommitsObj.map(o => {
        return o.sha;
      });

      console.log({ remoteCommits });

      // Get the commits that the user doesn't have i.e. that need to be retrieved.
      let index = remoteCommits.length;
      if (commits.length > 0) {
        index = remoteCommits.indexOf(commits[0]);
      }

      console.log(index);
      let commitsToGet = [];
      if (index > -1) {
        commitsToGet = remoteCommits.slice(0, index);
      } else {
        throw new Error(
          "Unable to determine which commits to retrieve from remote."
        );
      }
      console.log({ commitsToGet });

      // Go through each of the missing GitHub commits, updating the files in the repo (from the commit)
      // (from latest to oldest, unless a file has previously been updated by a newer commit).
      if (commitsToGet.length > 0) {
        // Storage of already updated files (we only want the latest values).
        const updatedFiles = {};
        for (const sha of commitsToGet) {
          const { data: commitData } = await octokit.repos.getCommit({
            owner: remote.user,
            repo: remote.repo,
            commit_sha: sha
          });
          console.log(commitData.files);
        }

        // Set the active theme to the newly updated i.e. reload.
        // @ts-ignore
        AppEnv.themes.setActiveTheme(theme);
      }
    } else {
      console.log("Current theme is part of mailspring so not updating.");
    }
  }

  componentWillUnmount() {
    console.log("Theme updater plugin unmounted.");
  }

  render() {
    return <div className="theme-updater-plugin" />;
  }
}

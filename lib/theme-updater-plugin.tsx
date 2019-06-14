import { React, FocusedContentStore, Thread } from "mailspring-exports";
import { Repository } from "nodegit";

export default class ThemeUpdaterPlugin extends React.Component<{}, {}> {
  static displayName = "ThemeUpdaterPlugin";

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    console.log("ThemeUpdaterPlugin Mounted!");
    try {
      const repo: Repository = await Repository.open(
        "mailspring-agapanthus-theme"
      );
      // Pull new changes.
      await repo.fetch("origin");

      // Get the latest reference for the master branch.
      const master = await repo.getReference("master");

      // Checkout that reference.
      await repo.checkoutRef(master);
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {}

  render() {
    return <div className="theme-updater-plugin" />;
  }
}

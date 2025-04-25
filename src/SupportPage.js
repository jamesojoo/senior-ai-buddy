import React from "react";
import PageTemplate from "./components/PageTemplate";

const SupportPage = ({ user }) => (
  <div className="px-4 py-10">
    <PageTemplate title="🛟 Support Assistant" placeholder="Ask a support question..." user={user} />
  </div>
);

export default SupportPage;

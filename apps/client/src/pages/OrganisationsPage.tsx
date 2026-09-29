import { useState } from "react";
import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";

type Organisation = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
};

type DeletedOrganisation = {
  id: string;
  name: string;
};

function getErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function OrganisationPageFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="organisation-screen min-h-screen">
      <header className="dashboard-topbar mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/dashboard" className="home-brand" aria-label="Back to Team Quest dashboard">
          <span className="home-brand-mark grid place-items-center">
            <Building2 aria-hidden="true" size={21} />
          </span>
          <span>
            <span className="home-brand-name">Team Quest</span>
            <span className="home-brand-caption">ORGANISATION CONTROL</span>
          </span>
        </Link>
        <Link to="/dashboard" className="organisation-back-link">
          <ArrowLeft aria-hidden="true" size={16} />
          Dashboard
        </Link>
      </header>

      <div className="organisation-content mx-auto w-full max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
        <section className="organisation-heading">
          <p className="dashboard-kicker"><Building2 aria-hidden="true" size={15} /> {eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>
        {children}
        <footer className="dashboard-footer">
          <span>TEAM QUEST <span aria-hidden="true">/</span> ORGANISATIONS</span>
          <span>YOUR TEAM SPACES</span>
        </footer>
      </div>
    </main>
  );
}

export function OrganisationsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();
  const organisations = useQuery({
    queryKey: ["organisations"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Organisation[] }>("/organisation");
      return response.data.data;
    },
  });
  const createOrganisation = useMutation({
    mutationFn: async (values: { name: string; description: string }) => {
      await apiClient.post("/organisation", values);
    },
    onSuccess: async () => {
      setName("");
      setDescription("");
      setShowCreateForm(false);
      await queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOrganisation.mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <OrganisationPageFrame
      eyebrow="YOUR WORKSPACES"
      title="Organisations."
      description="Your team spaces, all in one place. Create a new organisation or manage an existing one."
    >
      <section className="organisation-list-panel" aria-label="Your organisations">
        <div className="organisation-list-heading">
          <div>
            <p className="organisation-form-kicker">WORKSPACE DIRECTORY</p>
            <h2>Your organisations</h2>
          </div>
          <button
            className="organisation-submit organisation-create-toggle"
            type="button"
            onClick={() => {
              setShowCreateForm((visible) => !visible);
              createOrganisation.reset();
            }}
          >
            <Plus aria-hidden="true" size={17} />
            {showCreateForm ? "Close form" : "Create organisation"}
          </button>
        </div>

        {showCreateForm && (
          <form className="organisation-form" onSubmit={handleSubmit}>
            <p className="organisation-form-kicker">NEW WORKSPACE</p>
            <label htmlFor="organisation-name">Organisation name</label>
            <input
              id="organisation-name"
              className="organisation-input"
              autoComplete="organization"
              maxLength={80}
              placeholder="e.g. Northstar Studio"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <label htmlFor="organisation-description">Description</label>
            <textarea
              id="organisation-description"
              className="organisation-input organisation-textarea"
              maxLength={500}
              placeholder="What will your team work on together?"
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {createOrganisation.error && (
              <p className="organisation-error" role="alert">{getErrorMessage(createOrganisation.error)}</p>
            )}
            <button className="organisation-submit" type="submit" disabled={createOrganisation.isPending}>
              <Building2 aria-hidden="true" size={17} />
              {createOrganisation.isPending ? "Creating..." : "Create organisation"}
            </button>
          </form>
        )}

        {organisations.isPending && (
          <p className="organisation-list-state"><RefreshCw aria-hidden="true" size={16} /> Loading organisations...</p>
        )}
        {organisations.isError && (
          <div className="organisation-list-state organisation-list-error" role="alert">
            <p>{getErrorMessage(organisations.error)}</p>
            <button type="button" onClick={() => void organisations.refetch()}>Try again</button>
          </div>
        )}
        {organisations.isSuccess && organisations.data.length === 0 && (
          <div className="organisation-empty-state">
            <span className="organisation-result-icon"><Building2 aria-hidden="true" size={22} /></span>
            <h3>No organisations yet</h3>
            <p>Create a workspace to start bringing your team’s work together.</p>
          </div>
        )}
        {organisations.isSuccess && organisations.data.length > 0 && (
          <ul className="organisation-list">
            {organisations.data.map((organisation) => (
              <li className="organisation-list-item" key={organisation.id}>
                <span className="organisation-list-icon"><Building2 aria-hidden="true" size={19} /></span>
                <div className="organisation-list-copy">
                  <h3>{organisation.name}</h3>
                  <p>{organisation.description || "No description"}</p>
                  <code>{organisation.id}</code>
                </div>
                <Link
                  className="organisation-row-delete"
                  to={`/organisations/delete?id=${encodeURIComponent(organisation.id)}`}
                  aria-label={`Delete ${organisation.name}`}
                  title="Delete organisation"
                >
                  <Trash2 aria-hidden="true" size={17} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </OrganisationPageFrame>
  );
}

export function DeleteOrganisationPage() {
  const [searchParams] = useSearchParams();
  const [organisationId, setOrganisationId] = useState(searchParams.get("id") ?? "");
  const [confirmationText, setConfirmationText] = useState("");
  const queryClient = useQueryClient();
  const deleteOrganisation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ data: DeletedOrganisation }>(
        `/organisation/${encodeURIComponent(id)}`,
        { data: { confirmation: true } },
      );
      return response.data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteOrganisation.mutate(organisationId.trim());
  };

  return (
    <OrganisationPageFrame
      eyebrow="WORKSPACE / DELETE"
      title="Remove an organisation."
      description="This permanently removes the organisation and its memberships. Only its owner can complete this action."
    >
      <section className="organisation-form-panel organisation-delete-panel" aria-label="Delete organisation">
        {deleteOrganisation.data ? (
          <div className="organisation-result" role="status">
            <span className="organisation-result-icon organisation-result-danger"><Trash2 aria-hidden="true" size={22} /></span>
            <p className="organisation-form-kicker">ORGANISATION DELETED</p>
            <h2>{deleteOrganisation.data.name}</h2>
            <p>The organisation and its memberships have been removed.</p>
            <Link className="organisation-submit organisation-link-button" to="/organisations">
              <ArrowLeft aria-hidden="true" size={17} />
              Back to organisations
            </Link>
          </div>
        ) : (
          <form className="organisation-form" onSubmit={handleSubmit}>
            <p className="organisation-form-kicker">PERMANENT ACTION</p>
            <label htmlFor="organisation-id">Organisation ID</label>
            <input
              id="organisation-id"
              className="organisation-input"
              autoComplete="off"
              placeholder="Paste the organisation ID"
              required
              value={organisationId}
              onChange={(event) => setOrganisationId(event.target.value)}
            />
            <label htmlFor="delete-confirmation">Type DELETE to confirm</label>
            <input
              id="delete-confirmation"
              className="organisation-input"
              autoComplete="off"
              placeholder="DELETE"
              required
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
            />
            {deleteOrganisation.error && (
              <p className="organisation-error" role="alert">{getErrorMessage(deleteOrganisation.error)}</p>
            )}
            <button
              className="organisation-submit organisation-submit-danger"
              type="submit"
              disabled={deleteOrganisation.isPending || confirmationText !== "DELETE" || !organisationId.trim()}
            >
              <Trash2 aria-hidden="true" size={17} />
              {deleteOrganisation.isPending ? "Deleting..." : "Permanently delete"}
            </button>
          </form>
        )}
      </section>
    </OrganisationPageFrame>
  );
}
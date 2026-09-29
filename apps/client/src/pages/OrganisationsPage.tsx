import { useState } from "react";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Building2, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";

type CreatedOrganisation = {
  id: string;
  organisation: {
    id: string;
    name: string;
    description: string;
  };
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
          <Link to="/organisations/new">CREATE AN ORGANISATION <ArrowRight aria-hidden="true" size={12} /></Link>
        </footer>
      </div>
    </main>
  );
}

export function CreateOrganisationPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createOrganisation = useMutation({
    mutationFn: async (values: { name: string; description: string }) => {
      const response = await apiClient.post<{ data: CreatedOrganisation }>("/organisation", values);
      return response.data.data;
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOrganisation.mutate({ name: name.trim(), description: description.trim() });
  };

  return (
    <OrganisationPageFrame
      eyebrow="WORKSPACE / CREATE"
      title="Start a new organisation."
      description="Give your team a shared home for its boards, sections, and work."
    >
      <section className="organisation-form-panel" aria-label="Create organisation">
        {createOrganisation.data ? (
          <div className="organisation-result" role="status">
            <span className="organisation-result-icon"><Building2 aria-hidden="true" size={22} /></span>
            <p className="organisation-form-kicker">ORGANISATION CREATED</p>
            <h2>{createOrganisation.data.organisation.name}</h2>
            <p>{createOrganisation.data.organisation.description}</p>
            <div className="organisation-id-row">
              <span>Organisation ID</span>
              <code>{createOrganisation.data.id}</code>
            </div>
            <Link
              className="organisation-danger-link"
              to={`/organisations/delete?id=${encodeURIComponent(createOrganisation.data.id)}`}
            >
              <Trash2 aria-hidden="true" size={16} />
              Delete this organisation
            </Link>
            <button className="organisation-secondary-button" type="button" onClick={() => createOrganisation.reset()}>
              Create another
            </button>
          </div>
        ) : (
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
      </section>
    </OrganisationPageFrame>
  );
}

export function DeleteOrganisationPage() {
  const [searchParams] = useSearchParams();
  const [organisationId, setOrganisationId] = useState(searchParams.get("id") ?? "");
  const [confirmationText, setConfirmationText] = useState("");
  const deleteOrganisation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete<{ data: DeletedOrganisation }>(
        `/organisation/${encodeURIComponent(id)}`,
        { data: { confirmation: true } },
      );
      return response.data.data;
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
            <Link className="organisation-submit organisation-link-button" to="/dashboard">
              <ArrowLeft aria-hidden="true" size={17} />
              Return to dashboard
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
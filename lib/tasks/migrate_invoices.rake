# NOTE: only doing this in development as some production environments (Heroku)
# NOTE: are sensitive to local FS writes, and besides -- it's just not proper
# NOTE: to have a dev-mode tool do its thing in production.
if Rails.env.development?
  task :mark_paid do
    # You can override any of these by setting an environment variable of the
    # same name.

    Invoice.all.find_each(&:save)
  end
end

class Types::CreditCardChargeType < Types::BaseObject
  graphql_name "CreditCardCharge"
  description "Debit on a Credit Card"
  include Concerns::Permissable
  include Concerns::ApprovableWithLog

  implements Interfaces::CreditCardItemInterface
  implements Interfaces::ValidatableInterface
end

class Types::CreditCardPaymentType < Types::BaseObject
  graphql_name "CreditCardPayment"
  description "Credit on a Credit Card"

  include Concerns::Permissable
  include Concerns::ApprovableWithLog

  implements Interfaces::CreditCardItemInterface
  implements Interfaces::ValidatableInterface

  field :number, String, null: true
end

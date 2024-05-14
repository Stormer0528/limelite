# #
# Basic Setup Site

# Organization
test_org = FactoryBot.create :organization, name: "Test Org", subdomain: :test

# Users
super_admin_user = FactoryBot.create :super_admin_user
back_office_user = FactoryBot.create :back_office_user

owner_user  = FactoryBot.create :user
editor_user = FactoryBot.create :user
viewer_user = FactoryBot.create :user

# Organization Assignments for users
OrganizationAssignment.create!([
                                 {user: owner_user, organization: test_org, type: "OwnerAssignment"},
                                 {user: editor_user, organization: test_org, type: "EditorAssignment"},
                                 {user: viewer_user, organization: test_org, type: "ViewerAssignment"}
                               ])

# Account Elements
AccountFund.create!([
                      {name: "New Vision Middle School", code: "1089", organization: test_org},
                      {name: "Entrepreneur HS", code: "1922", organization: test_org},
                      {name: "The Journey School", code: "1974", organization: test_org},
                      {name: "iEmpire Academy", code: "1153", organization: test_org},
                      {name: "Entrepreneur High School Fontana", code: "2095", organization: test_org}
                    ])
AccountResource.create!([
                          {"name" => "Unrestricted", "code" => "0000", :organization => test_org,
                           "restricted" => false},
                          {"name" => "Lottery: Unrestricted", "code" => "1100",
                           :organization => test_org, "restricted" => false},
                          {"name" => "Education Protection Account", "code" => "1400",
                           :organization => test_org, "restricted" => false},
                          {"name" => "NCLB: Title I, Part A", "code" => "3010",
                           :organization => test_org, "restricted" => true},
                          {"name" => "Special Ed: IDEA Basic Local Assistance Entitlement, Part B, Sec 611", "code" => "3310",
                           :organization => test_org, "restricted" => true},
                          {"name" => "NCLB: Title II, Part A", "code" => "4035",
                           :organization => test_org, "restricted" => true},
                          {"name" => "NCLB: Title III, LEP Student Program", "code" => "4203",
                           :organization => test_org, "restricted" => true},
                          {"name" => "Title IV, Part A - Student Support and Academic Enrichment Grant Program",
                           "code" => "4127", :organization => test_org, "restricted" => true},
                          {"name" => "NCLB: Title V, Part B", "code" => "4610", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Child Nutrition: School Programs", "code" => "5310", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Lottery: Instructional Material\t", "code" => "6300", :organization => test_org,
                           "restricted" => true},
                          {"name" => "After School Education and Safety (ASES)", "code" => "6010", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Special Education", "code" => "6500", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Special Ed: Mental Health Services", "code" => "6512", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Child Nutrition: NSLP Equipment Assistance Grants", "code" => "5314",
                           :organization => test_org, "restricted" => true},
                          {"name" => "Charter School Facility Grant Program", "code" => "6030", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Innovative Approaches to Literacy Program", "code" => "5850", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Low-Performing Students Block Grant", "code" => "7510", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Child Nutrition: School Breakfast Startup", "code" => "5380", :organization => test_org,
                           "restricted" => true},
                          {"name" => "ESSA: School Improvement Funding for LEAs", "code" => "3182", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Mental Health Service Professional Demonstration Grant Program", "code" => "5810",
                           :organization => test_org, "restricted" => true},
                          {"name" => "Paycheck Protection Program", "code" => "5820", :organization => test_org,
                           "restricted" => true},
                          {"name" => "SB 117 COVID-19 LEA Response Funds", "code" => "7388", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Governor's Emergency Education Relief (GEER) Fund: Learning Loss Mitigation",
                           "code" => "3215", :organization => test_org, "restricted" => true},
                          {"name" => "Coronavirus Relief Fund (CRF): Learning Loss Mitigation", "code" => "3220",
                           :organization => test_org, "restricted" => true},
                          {"name" => "State Learning Loss Mitigation Funds", "code" => "7420", :organization => test_org,
                           "restricted" => true},
                          {"name" => "Elementary and Secondary School Emergency Relief (ESSER) Fund", "code" => "3210",
                           :organization => test_org,   "restricted" => true},
                          {"name" => "FBLA Chapter Grant", "code" => "9011", :organization => test_org,
                           "restricted" => false}
                        ])
# Accounts

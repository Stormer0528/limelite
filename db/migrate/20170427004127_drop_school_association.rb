class DropSchoolAssociation < ActiveRecord::Migration[5.0]
  def up
    convert_school_assignments
    drop_table :school_assignments
  end

  def down
    create_table :school_assignments do |t|
      t.references :user, foreign_key: true
      t.references :school, foreign_key: true
      t.string :type

      t.timestamps
    end
  end

  def convert_school_assignments
    return unless class_exists?("SchoolAssignment")

    SchoolAssignment.all.each do |sa|
      old_params = sa.attributes.to_h
      old_params["organization_id"] = old_params.delete("school_id")
      new_assignment = OrganizationAssignment.new
      new_assignment.attributes = old_params
      new_assignment.save!
    end
  end

  def class_exists?(class_name)
    klass = Module.const_get(class_name)
    return klass.is_a?(Class)
  rescue NameError
    return false
  end
end

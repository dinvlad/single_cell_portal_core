class StudyAccession
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :study, optional: true
  field :accession, type: String

  validates_uniqueness_of :accession

  # is this accession currently assigned to an existing study?
  def assigned?
    self.study.present?
  end

  def self.next_available
    current_count = self.count
    "SCP#{current_count + 1}"
  end

  def self.assign_accessions
    Study.all.each do |study|
      puts "Assigning accession for #{study.name}"
      study.assign_accession
      puts "Accession for #{study.name} assigned: #{study.accession}"
    end
  end
end
